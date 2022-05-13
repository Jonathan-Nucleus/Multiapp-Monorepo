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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import {
  CaretLeft,
  DotsThreeVertical,
  EyeClosed,
  PaperPlaneRight,
  Pencil,
  Trash,
  UserCirclePlus,
  WarningOctagon,
} from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import Header from 'mobile/src/components/main/Header';
import PLabel from 'mobile/src/components/common/PLabel';
import PostItem from 'mobile/src/components/main/PostItem';
import UserInfo from 'mobile/src/components/common/UserInfo';
import SelectionModal from 'mobile/src/components/common/SelectionModal';
import { showMessage } from 'mobile/src/services/utils';
import {
  BLACK,
  PRIMARY,
  PRIMARYSOLID,
  PRIMARYSOLID7,
  WHITE,
} from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, Body3, Body3Bold } from 'mobile/src/theme/fonts';
import { SOMETHING_WRONG } from 'shared/src/constants';

import LikesModal from './LikesModal';
import CommentItem from './CommentItem';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import {
  useCommentPost,
  useEditCommentPost,
} from 'shared/graphql/mutation/posts';
import { usePost, Comment } from 'shared/graphql/query/post/usePost';
import { useHideUser } from 'shared/graphql/mutation/account';
import { useAccount } from 'shared/graphql/query/account/useAccount';

import { PostDetailScreen } from 'mobile/src/navigations/PostDetailsStack';

type CommentUser = Comment['user'];
const CommentMenuDataArray = [
  {
    label: 'Edit Comment',
    icon: <Pencil size={26} color={WHITE} />,
    key: 'edit',
  },
  {
    label: 'Delete Comment',
    icon: <Trash size={26} color={WHITE} />,
    key: 'delete',
  },
];

const PostDetail: PostDetailScreen = ({ route }) => {
  const { postId } = route.params;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { data, refetch } = usePost(postId);
  const [commentPost] = useCommentPost();
  const [editComment] = useEditCommentPost();

  const [comment, setComment] = useState('');
  const [selectedUser, setSelectedUser] = useState<CommentUser | undefined>(
    undefined,
  );
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  const [isReplyComment, setReplyComment] = useState(false);
  const [isEditComment, setEditComment] = useState(false);
  const inputRef = useRef<TextInput | null>(null);

  const post = data?.post;
  const comments = post?.comments;
  const likes = post?.likes;

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

  if (!post || !comments || !likes) {
    return <SafeAreaView style={pStyles.globalContainer} />;
  }

  const handleAddComment = async () => {
    try {
      let commentData = {
        body: comment,
        postId: post._id,
        mentionIds: [],
        ...(focusCommentId ? { commentId: focusCommentId } : {}),
      };

      const { data } = await commentPost({
        variables: {
          comment: commentData,
        },
      });

      if (data?.comment) {
        initInputComment();
        refetch();
      }
    } catch (err) {
      console.log('add comment error:', err);
    }
  };

  const handleEditComment = async () => {
    if (!focusCommentId) {
      return;
    }

    try {
      const { data } = await editComment({
        variables: {
          comment: {
            _id: focusCommentId,
            body: comment,
            mentionIds: [],
            mediaUrl: '',
          },
        },
        refetchQueries: ['Posts'],
      });

      if (data?.editComment) {
        console.log('edit comment success');
        initInputComment();
      } else {
        console.log('edit comment error');
      }
    } catch (err) {
      console.log('edit comment error', err);
    }
  };

  const initInputComment = () => {
    setComment('');
    setFocusCommentId(null);
    setReplyComment(false);
    setEditComment(false);
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
        setComment(comment.body);
        setEditComment(true);
        setFocusCommentId(comment._id);
        inputRef?.current?.focus();
      }}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer} edges={['bottom']}>
      <Header
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        onPressLeft={() => NavigationService.goBack()}
      />
      <PAppContainer style={styles.container}>
        <PostItem post={post} onPressLikes={() => setLikesModalVisible(true)} />
        <FlatList
          data={getComments || []}
          renderItem={renderCommentItem}
          contentContainerStyle={styles.commentContainer}
        />
      </PAppContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}>
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
        <View style={styles.inputContainer}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            style={[
              styles.input,
              isEditComment ? { width: '100%' } : { width: '90%' },
            ]}
            ref={inputRef}
          />
          {!isEditComment && (
            <TouchableOpacity onPress={handleAddComment}>
              <PaperPlaneRight size={32} color={WHITE} />
            </TouchableOpacity>
          )}
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
              onPress={handleEditComment}>
              <PLabel label="Update" textStyle={Body3Bold} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
      <LikesModal
        likes={likes}
        isVisible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    backgroundColor: BLACK,
    marginBottom: 0,
  },
  commentContainer: {
    paddingHorizontal: 16,
  },
  userItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    paddingVertical: 12,
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
    height: 40,
  },
  input: {
    backgroundColor: WHITE,
    padding: 16,
    paddingTop: 16, // important
    minHeight: 36,
    maxHeight: 200,
    borderRadius: 24,
  },
  bodyContent: {
    marginLeft: 40,
  },
  actionContainer: {
    marginLeft: 32,
    flexDirection: 'row',
    marginVertical: 8,
  },
  smallLabel: {
    ...Body3,
    marginRight: 8,
    padding: 8,
  },
  likedLabel: {
    color: PRIMARY,
  },
  updateContainer: {
    backgroundColor: BLACK,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    marginRight: 16,
  },
  // TODO: global component for button
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
