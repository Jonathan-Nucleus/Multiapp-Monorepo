import React, {
  ReactElement,
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';
import _isEqual from 'lodash/isEqual';
import {
  useMentionUsers,
  User,
} from 'shared/graphql/query/user/useMentionUsers';
import { FieldValues, Path, UseFormReturn, Controller } from 'react-hook-form';

import { Body2 } from '../../theme/fonts';
import { WHITE, WHITE60, GRAY700, PRIMARY } from 'shared/src/colors';

import { POST_PATTERN } from 'shared/src/patterns';

export type { User };
export type OnSelectUser = (user: User) => void;

interface ExpandingInputProps<TFieldValues extends FieldValues>
  extends Omit<TextInputProps, 'multiline'> {
  containerStyle?: StyleProp<ViewStyle>;
  viewAbove?: React.ReactNode;
  viewLeft?: React.ReactNode;
  viewRight?: React.ReactNode;
  viewBelow?: React.ReactNode;
  renderUsers: (users: User[], onPress: OnSelectUser) => void;

  /** The name of this input field */
  name: Path<TFieldValues>;
  control: UseFormReturn<TFieldValues>['control'];
}

declare module 'react' {
  function forwardRef<T, P = unknown>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const ExpandingInput = forwardRef(function <TFieldValues extends FieldValues>(
  props: ExpandingInputProps<TFieldValues>,
  ref: React.ForwardedRef<TextInput>,
): ReactElement {
  const {
    control,
    name,
    containerStyle,
    viewAbove,
    viewLeft,
    viewRight,
    viewBelow,
    renderUsers,
    ...inputProps
  } = props;

  const { data: usersData, refetch } = useMentionUsers();
  const mentionUsers = useRef(usersData?.mentionUsers ?? []);
  const [textInputHeight, setTextInputHeight] = useState<number>();
  const mentionUndefinedCount = useRef(0);
  const inputRef = useRef<TextInput>();
  const currentSearch = useRef<string>();
  const lastSearch = useRef<string>();
  const nextSearch = useRef<string>();
  const suggestionCallback =
    useRef<MentionSuggestionsProps['onSuggestionPress']>();

  const updateMentionUsers = (users: User[]): void => {
    mentionUsers.current = users;
    renderUsers(users, onPress);
  };

  const clearMentions = (): void => {
    // Avoid issue with setting state from inside renderSuggestion render
    // cycle
    setTimeout(() => {
      updateMentionUsers([]);
      lastSearch.current = undefined;
      currentSearch.current = undefined;
      nextSearch.current = undefined;
    }, 10);
  };

  const onPress = (user: User): void => {
    if (!suggestionCallback.current) {
      return;
    }

    suggestionCallback.current({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
    });
    clearMentions();
  };

  const fetchMentionUsers = async (search: string): Promise<void> => {
    if (search === lastSearch.current) {
      return;
    }

    if (currentSearch.current !== undefined) {
      nextSearch.current = search;
      return;
    }

    currentSearch.current = search;
    const { data } = await refetch({ search });

    if (data.mentionUsers && !_isEqual(mentionUsers, data.mentionUsers)) {
      updateMentionUsers(data.mentionUsers);
    }

    lastSearch.current = currentSearch.current;
    currentSearch.current = undefined;
    if (nextSearch.current) {
      fetchMentionUsers(nextSearch.current);
      nextSearch.current = undefined;
    }
  };

  const renderSuggestions = ({
    keyword,
    onSuggestionPress,
  }: MentionSuggestionsProps): React.ReactNode => {
    if (keyword === undefined) {
      mentionUndefinedCount.current++;
      if (mentionUndefinedCount.current > 1) {
        mentionUndefinedCount.current = 0;
        clearMentions();
        return null;
      }
    } else {
      mentionUndefinedCount.current = 0;
    }

    if (keyword !== undefined) {
      fetchMentionUsers(keyword);
    }

    if (mentionUsers.current.length === 0) {
      return null;
    }

    suggestionCallback.current = onSuggestionPress;
    return null;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Pressable
          style={[styles.container, containerStyle]}
          onPress={() => inputRef.current?.focus()}>
          {viewLeft ? viewLeft : null}
          <View style={styles.flex}>
            {viewAbove}
            <MentionInput
              placeholderTextColor={WHITE60}
              keyboardAppearance="dark"
              {...inputProps}
              inputRef={(textInputRef) => {
                if (textInputRef) {
                  inputRef.current = textInputRef;
                }

                if (typeof ref === 'function') {
                  ref?.(textInputRef);
                } else if (ref) {
                  ref.current = textInputRef;
                }
              }}
              value={field.value ?? ''}
              onChange={field.onChange}
              onContentSizeChange={(evt) => {
                const {
                  nativeEvent: {
                    contentSize: { height },
                  },
                } = evt;
                const newHeight = height + styles.container.paddingVertical;
                if (textInputHeight !== newHeight) {
                  setTextInputHeight(newHeight);
                }
              }}
              style={[
                styles.textInput,
                {
                  height: textInputHeight,
                },
                inputProps.style,
              ]}
              partTypes={[
                {
                  isBottomMentionSuggestionsRender: true,
                  isInsertSpaceAfterMention: true,
                  trigger: '@',
                  renderSuggestions,
                  textStyle: {
                    color: PRIMARY,
                  },
                },
                {
                  pattern: POST_PATTERN,
                  textStyle: {
                    color: PRIMARY,
                  },
                },
              ]}
            />
            {viewBelow}
          </View>
          {viewRight ? viewRight : null}
        </Pressable>
      )}
    />
  );
});

export default ExpandingInput;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY700,
    borderRadius: 16,
    minHeight: 40,
    paddingVertical: 8,
  },
  textInput: {
    color: WHITE,
    padding: 0,
    textAlignVertical: 'top',
    ...Body2,
    lineHeight: 20,
    marginTop: -4,
  },
});
