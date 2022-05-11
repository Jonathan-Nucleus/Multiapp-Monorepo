import React, { useCallback, useMemo, useRef, useState } from 'react';
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

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import {
  useCommentPost,
  useDeleteComment,
  useEditCommentPost,
  useLikeComment,
} from 'mobile/src/graphql/mutation/posts';
import { usePost, Comment } from 'mobile/src/graphql/query/post';
import {
  useFollowUser,
  useHideUser,
} from 'mobile/src/graphql/mutation/account';
import { useCachedAccount } from 'mobile/src/graphql/query/account/useAccount';

import { PostDetailScreen } from 'mobile/src/navigations/PostDetailsStack';
import MainHeader from '../../components/main/Header';

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

  const [comment, setComment] = useState('');
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false); // someone's comment
  const [commentMenuVisible, setCommentMenuVisible] = useState(false); // own comment
  const [selectedUser, setSelectedUser] = useState<CommentUser | undefined>(
    undefined,
  );
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const [isReplyComment, setReplyComment] = useState(false);
  const [isEditComment, setEditComment] = useState(false);

  const { data, refetch } = usePost(postId);
  const [commentPost] = useCommentPost();
  const [deleteComment] = useDeleteComment();
  const [editComment] = useEditCommentPost();
  const [followUser] = useFollowUser();
  const [hideUser] = useHideUser();
  const account = useCachedAccount();
  const [likeComment] = useLikeComment();

  const isFollowing = account?.followingIds?.includes(selectedUser?._id ?? '');

  const getKebobMenuData = useMemo(() => {
    const KebobMenuDataArray = [
      {
        label: `${isFollowing ? 'Unfollow' : 'Follow'} ${
          selectedUser?.firstName
        } ${selectedUser?.lastName}`,
        icon: <UserCirclePlus size={32} color={WHITE} />,
        key: 'follow',
      },
      {
        label: 'Report comment',
        icon: <WarningOctagon size={32} color={WHITE} />,
        key: 'report',
      },
      {
        label: `Hide ${selectedUser?.firstName} ${selectedUser?.lastName}`,
        icon: <EyeClosed size={32} color={WHITE} />,
        key: 'hide',
      },
    ];

    return KebobMenuDataArray;
  }, [selectedUser, isFollowing]);

  const post = data?.post;
  const comments = post?.comments;
  const likes = post?.likes;

  if (!post || !comments || !likes) {
    return <SafeAreaView style={pStyles.globalContainer} />;
  }

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

  const renderCommentItem: ListRenderItem<typeof getComments[number]> = ({
    item,
  }) => <CommentItem item={item} />;

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

  const handleDeleteComment = async () => {
    if (!focusCommentId) {
      return;
    }

    try {
      const { data } = await deleteComment({
        variables: { commentId: focusCommentId },
      });
      if (data?.deleteComment) {
        console.log('delete comment success');
      } else {
        console.log('delete comment error');
      }
    } catch (err) {
      console.log('delete comment error', err);
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

  const handleFollowUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const { data } = await followUser({
        variables: { follow: !isFollowing, userId: selectedUser._id },
      });
      if (data?.followUser) {
        showMessage(
          'success',
          isFollowing
            ? `You’re unfollowing ${selectedUser.firstName} ${selectedUser.lastName}`
            : `You’re following ${selectedUser.firstName} ${selectedUser.lastName}`,
        );
        refetch();
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleHideUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const { data } = await hideUser({
        variables: { hide: true, userId: selectedUser._id },
      });
      if (data?.hideUser) {
        showMessage('success', 'Successfully hided user!');
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const initInputComment = () => {
    setComment('');
    setFocusCommentId(null);
    setReplyComment(false);
    setEditComment(false);
    inputRef?.current?.blur();
  };

  // TODO move to separate component
  const CommentItem = ({ item }: { item: Comment }) => {
    const { _id, commentId, user, body, createdAt } = item;
    const [liked, setLiked] = useState(
      (account && item.likeIds?.includes(account._id)) ?? false,
    );

    const commentItemContainer = {
      marginLeft: commentId ? 32 : 0,
    };

    const toggleLike = async () => {
      const toggled = !liked;
      const { data } = await likeComment({
        variables: { like: toggled, commentId: item._id },
      });

      data && data.likeComment
        ? setLiked(toggled)
        : console.log('Error liking comment');
    };

    return (
      <View style={commentItemContainer}>
        <View style={styles.userItemContainer}>
          <UserInfo
            user={user}
            avatarSize={32}
            viewStyle={styles.userInfoContainer}
          />
          <TouchableOpacity
            onPress={() => {
              setFocusCommentId(_id);
              if (user._id === account?._id) {
                setCommentMenuVisible(true);
              } else {
                setSelectedUser(user);
                setKebobMenuVisible(true);
              }
            }}>
            <DotsThreeVertical size={24} color={WHITE} />
          </TouchableOpacity>
        </View>
        <PLabel label={body} viewStyle={styles.bodyContent} />
        <View style={styles.actionContainer}>
          <PLabel
            label={moment(createdAt).fromNow()}
            textStyle={styles.smallLabel}
          />
          <TouchableOpacity onPress={toggleLike}>
            <PLabel
              label="Like"
              textStyle={[styles.smallLabel, liked ? styles.likedLabel : {}]}
            />
          </TouchableOpacity>
          {!commentId && (
            <TouchableOpacity
              onPress={() => {
                setReplyComment(true);
                setFocusCommentId(_id);
                setSelectedUser(user);
                inputRef?.current?.focus();
              }}>
              <PLabel label="Reply" textStyle={styles.smallLabel} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
      <SelectionModal
        isVisible={kebobMenuVisible}
        dataArray={getKebobMenuData}
        buttonLabel="Cancel"
        onPressCancel={() => setKebobMenuVisible(false)}
        onPressItem={(key) => {
          setKebobMenuVisible(false);
          setTimeout(() => {
            if (key === 'follow') {
              handleFollowUser();
            } else if (key === 'hide') {
              handleHideUser();
            }
          }, 500);
        }}
      />
      <LikesModal
        likes={likes}
        isVisible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
      />
      <SelectionModal
        isVisible={commentMenuVisible}
        dataArray={CommentMenuDataArray}
        buttonLabel="Cancel"
        onPressCancel={() => setCommentMenuVisible(false)}
        onPressItem={(key) => {
          setCommentMenuVisible(false);
          setTimeout(() => {
            if (key === 'edit') {
              setEditComment(true);
              inputRef?.current?.focus();
            } else if (key === 'delete') {
              handleDeleteComment();
            }
          }, 500);
        }}
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
