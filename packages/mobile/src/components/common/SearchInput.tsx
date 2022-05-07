import React, { useState, forwardRef } from 'react';
import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { X, MagnifyingGlass } from 'phosphor-react-native';

import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, GRAY800 } from 'shared/src/colors';
import { Body2, Body3 } from '../../theme/fonts';

interface SearchInputProps extends Omit<TextInputProps, 'numberOfLines'> {
  containerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;
  focusStyle?: StyleProp<ViewStyle>;
}

const SearchInput = forwardRef<TextInput, SearchInputProps>(
  ({ containerStyle, focusStyle, onClear, ...inputProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const flatStyles = StyleSheet.flatten(inputProps.style);
    return (
      <View style={[styles.textContainer, containerStyle]}>
        <TextInput
          {...inputProps}
          ref={ref}
          keyboardAppearance="dark"
          style={[
            styles.textInput,
            inputProps.style,
            ...(isFocused ? [styles.focusStyle, focusStyle] : []),
          ]}
          onFocus={(evt) => {
            setIsFocused(true);
            inputProps.onFocus?.(evt);
          }}
          onBlur={(evt) => {
            setIsFocused(false);
            inputProps.onBlur?.(evt);
          }}
        />
        <View
          style={[
            styles.icon,
            flatStyles?.height ? { height: flatStyles.height } : null,
          ]}>
          {inputProps.value ? (
            <Pressable
              onPress={() => onClear?.()}
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
              <X size={14} color={WHITE} />
            </Pressable>
          ) : (
            <MagnifyingGlass size={14} color={WHITE} />
          )}
        </View>
      </View>
    );
  },
);

export default SearchInput;

const styles = StyleSheet.create({
  textContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  textInput: {
    ...Body3,
    color: WHITE,
    height: 34,
    borderColor: GRAY800,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    flex: 1,
  },
  icon: {
    position: 'absolute',
    right: 28,
    height: 34,
    justifyContent: 'center',
  },
  focusStyle: {
    borderColor: WHITE,
  },
});
