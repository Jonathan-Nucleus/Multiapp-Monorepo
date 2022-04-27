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
import { AVATAR_URL } from 'react-native-dotenv';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

import PAppContainer from '../../components/common/PAppContainer';
import PLabel from '../../components/common/PLabel';
import SelectionModal, {
  MenuDataItemProps,
} from '../../components/common/SelectionModal';
import PostItem from '../../components/main/PostItem';
import { PostDetailScreen } from '../../navigations/HomeStack';
import UserInfo from '../../components/common/UserInfo';
import LikesModal from './LikesModal';
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
import PHeader from '../../components/common/PHeader';
import * as NavigationService from '../../services/navigation/NavigationService';
import { showMessage } from '../../services/utils';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { BLACK, WHITE } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';
import { Body2Bold, Body3 } from '../../theme/fonts';

import { useCommentPost, useDeleteComment } from '../../graphql/mutation/posts';
import { usePost, Post, Comment } from '../../graphql/query/post';
import { useFollowUser, useHideUser } from '../../graphql/mutation/account';

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
  const { postId, userId } = route.params;

  const [comment, setComment] = useState('');
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CommentUser | undefined>(
    undefined,
  );
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [focusCommentId, setFocusCommentId] = useState<string | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const { data, refetch } = usePost(postId);
  const [commentPost] = useCommentPost();
  const [deleteComment] = useDeleteComment();
  const [followUser] = useFollowUser();
  const [hideUser] = useHideUser();

  const getKebobMenuData = useMemo(() => {
    const KebobMenuDataArray = [
      {
        label: `Follow ${selectedUser?.firstName} ${selectedUser?.lastName}`,
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
  }, [selectedUser]);

  if (!data || !data.post) {
    return (
      <SafeAreaView
        style={pStyles.globalContainer}
        edges={['right', 'top', 'left']}></SafeAreaView>
    );
  }

  const { post } = data;
  const { comments, likes } = post;

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
    if (!selectedUser) {
      return;
    }

    try {
      const { data } = await deleteComment({
        variables: { commentId: selectedUser._id },
      });
      if (data?.deleteComment) {
        showMessage('success', 'Successfully deleted!');
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleFollowUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const { data } = await followUser({
        variables: { follow: true, userId: selectedUser._id },
      });
      if (data?.followUser) {
        showMessage('success', 'Successfully followed user!');
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
    inputRef?.current?.blur();
  };

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

  const CommentItem = ({ item }: { item: Comment }) => {
    const { _id, commentId, user, body, createdAt } = item;
    const commentItemContainer = {
      marginLeft: commentId ? 32 : 0,
    };

    return (
      <View style={commentItemContainer}>
        <View style={styles.userItemContainer}>
          <UserInfo
            avatar={{ uri: `${AVATAR_URL}/${user.avatar}` }}
            name={`${user.firstName} ${user.lastName}`}
            company={user.company?.name}
            avatarSize={32}
            isPro
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedUser(user);
              setKebobMenuVisible(true);
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
          <TouchableOpacity>
            <PLabel label="Like" textStyle={styles.smallLabel} />
          </TouchableOpacity>
          {!commentId && (
            <TouchableOpacity
              onPress={() => {
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

  const renderCommentItem: ListRenderItem<typeof getComments[number]> =
    useCallback(({ item }) => <CommentItem item={item} />, [comments]);

  return (
    <SafeAreaView
      style={pStyles.globalContainer}
      edges={['right', 'top', 'left']}>
      <PHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        leftStyle={styles.sideStyle}
        onPressLeft={() => NavigationService.goBack()}
        containerStyle={styles.headerContainer}
      />
      <PAppContainer style={styles.container}>
        <PostItem post={post} userId={userId} />
        <FlatList data={getComments || []} renderItem={renderCommentItem} />
      </PAppContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}>
        {focusCommentId && (
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
            style={styles.input}
            ref={inputRef}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <PaperPlaneRight size={32} color={WHITE} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <SelectionModal
        isVisible={kebobMenuVisible}
        dataArray={getKebobMenuData}
        buttonLabel="Cancel"
        onPressCancel={() => setKebobMenuVisible(false)}
        onPressItem={(key) => {
          setKebobMenuVisible(false);
          if (key === 'follow') {
            handleFollowUser();
          } else if (key === 'hide') {
            handleHideUser();
          }
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
          if (key === 'edit') {
            // handleEditComment();
          } else if (key === 'delete') {
            handleDeleteComment();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: BLACK,
    marginBottom: 0,
    height: 62,
  },
  sideStyle: {
    top: 16,
  },
  userItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    backgroundColor: WHITE,
    padding: 11,
    paddingTop: 11, // important
    minHeight: 36,
    borderRadius: 24,
    width: '90%',
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
});
