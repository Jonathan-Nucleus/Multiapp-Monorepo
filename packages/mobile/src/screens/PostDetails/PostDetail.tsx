import React, { useMemo, useRef, useState } from 'react';
import {
  ListRenderItem,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, PaperPlaneRight } from 'phosphor-react-native';

import Header from 'mobile/src/components/main/Header';
import PLabel from 'mobile/src/components/common/PLabel';
import PostItem from 'mobile/src/components/main/posts/PostItem';
import CommentItem from 'mobile/src/components/main/posts/CommentItem';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { BLACK, PRIMARYSOLID, PRIMARYSOLID7, WHITE } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, Body3Bold } from 'mobile/src/theme/fonts';

import { useForm, Controller, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import ExpandingInput, {
  User,
  OnSelectUser,
} from 'mobile/src/components/common/ExpandingInput';
import MentionsList from 'mobile/src/components/main/MentionsList';

import {
  useCommentPost,
  useEditCommentPost,
} from 'shared/graphql/mutation/posts';
import { usePost, Comment } from 'shared/graphql/query/post/usePost';
import { parseMentions } from 'shared/src/patterns';

import { PostDetailScreen } from 'mobile/src/navigations/PostDetailsStack';

type CommentUser = Comment['user'];

type FormValues = {
  message: string;
};

const schema = yup
  .object({
    message: yup.string().trim().required('Required'),
  })
  .required();

const PostDetail: PostDetailScreen = ({ route }) => {
  const { postId, focusComment } = route.params;

  const { data, refetch } = usePost(postId);
  const [commentPost] = useCommentPost();
  const [editComment] = useEditCommentPost();

  const [selectedUser, setSelectedUser] = useState<CommentUser | undefined>(
    undefined,
  );
  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  const [isReplyComment, setReplyComment] = useState(false);
  const [isEditComment, setEditComment] = useState(false);
  const inputRef = useRef<TextInput | null>(null);
  const flatListRef = useRef<FlatList<Comment> | null>(null);
  const focusCommentRef = useRef(focusComment);
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const onMentionSelected = useRef<OnSelectUser>();

  const post = data?.post;
  const comments = post?.comments;

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });

  const getComments = useMemo(() => {
    const parentComments = comments?.filter((item) => !item.commentId);
    const childComments = comments?.filter((item) => item.commentId !== null);
    const updatedComments: Comment[] = [];
    parentComments?.forEach((parentComment) => {
      updatedComments.push(parentComment);
      childComments?.forEach((childComment) => {
        if (childComment.commentId === parentComment._id) {
          updatedComments.push(childComment);
        }
      });
    });
    return updatedComments;
  }, [comments]);

  if (!post) {
    return <SafeAreaView style={pStyles.globalContainer} />;
  }

  const onSubmit = async ({ message }: FormValues): Promise<void> => {
    try {
      let success = false;
      if (isEditComment && focusCommentId) {
        const result = await editComment({
          variables: {
            comment: {
              _id: focusCommentId,
              body: message,
              mentionIds: parseMentions(message),
              mediaUrl: '',
            },
          },
        });

        success = !!result.data?.editComment;
      } else {
        const result = await commentPost({
          variables: {
            comment: {
              body: message,
              postId: post._id,
              mentionIds: parseMentions(message),
              ...(focusCommentId ? { commentId: focusCommentId } : {}),
            },
          },
        });

        success = !!result.data?.comment;
      }

      if (success) {
        initInputComment();
        await refetch();

        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          500,
        );
      }
    } catch (err) {
      console.log('add comment error:', err);
    }
  };

  const initInputComment = (): void => {
    reset(
      schema.cast(
        {},
        { assert: false, stripUnknown: true },
      ) as DefaultValues<FormValues>,
    );

    setFocusCommentId(null);
    setReplyComment(false);
    setEditComment(false);
    focusCommentRef.current = false;
    inputRef?.current?.blur();
  };

  const renderCommentItem: ListRenderItem<typeof getComments[number]> = ({
    item,
  }) => (
    <CommentItem
      comment={item}
      onReply={(comment) => {
        setReplyComment(true);
        setFocusCommentId(comment._id);
        setSelectedUser(comment.user);
        inputRef?.current?.focus();
      }}
      onEdit={(comment) => {
        setValue('message', comment.body);
        setEditComment(true);
        setFocusCommentId(comment._id);
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 500);
      }}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer} edges={['bottom']}>
      <Header
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        onPressLeft={() => NavigationService.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          data={getComments || []}
          renderItem={renderCommentItem}
          ListHeaderComponent={
            <PostItem shouldOpenDocumentLink={true} post={post} />
          }
        />
        {isReplyComment && (
          <View style={styles.replyContainer}>
            <Text style={styles.headerReply}>
              Replying to
              <Text
                style={
                  styles.nameReply
                }>{` ${selectedUser?.firstName} ${selectedUser?.lastName}`}</Text>
            </Text>
            <TouchableOpacity onPress={initInputComment}>
              <PLabel label="Cancel" textStyle={styles.cancelReply} />
            </TouchableOpacity>
          </View>
        )}
        <View>
          <View style={styles.mentionContainer}>
            <MentionsList
              users={mentionUsers}
              onPress={(user) => onMentionSelected.current?.(user)}
            />
          </View>
          <View style={styles.inputContainer}>
            <ExpandingInput
              control={control}
              name="message"
              placeholder="Add a comment..."
              containerStyle={styles.textInputContainer}
              style={styles.textInput}
              renderUsers={(users, onSelected) => {
                setMentionUsers(users);
                onMentionSelected.current = onSelected;
              }}
              onFocus={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 1);
              }}
              ref={(ref) => {
                inputRef.current = ref;
                if (focusCommentRef.current && ref) {
                  ref.focus();
                  flatListRef.current?.scrollToEnd({ animated: true });
                  focusCommentRef.current = false;
                }
              }}
            />
            {!isEditComment && (
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) =>
                  pressed ? pStyles.pressedStyle : null
                }>
                <PaperPlaneRight size={32} color={WHITE} />
              </Pressable>
            )}
          </View>
        </View>
        {isEditComment && (
          <View style={styles.updateContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={initInputComment}>
              <PLabel label="Cancel" textStyle={Body3Bold} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleSubmit(onSubmit)}>
              <PLabel label="Update" textStyle={Body3Bold} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  replyContainer: {
    flexDirection: 'row',
    backgroundColor: BLACK,
    alignItems: 'center',
    marginLeft: 16,
  },
  headerReply: {
    color: WHITE,
  },
  nameReply: {
    ...Body2Bold,
  },
  cancelReply: {
    marginLeft: 12,
    padding: 8,
  },
  inputContainer: {
    backgroundColor: BLACK,
    marginLeft: 16,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  textInput: {
    paddingHorizontal: 16,
  },
  mentionContainer: {
    position: 'relative',
    height: 0,
  },
  updateContainer: {
    backgroundColor: BLACK,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    marginRight: 16,
  },
  updateBtn: {
    width: 100,
    height: 45,
    marginLeft: 16,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID7,
  },
  cancelBtn: {
    width: 80,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
