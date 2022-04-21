import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AVATAR_URL } from 'react-native-dotenv';
import { SafeAreaView } from 'react-native-safe-area-context';

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

import { useCommentPost, useDeleteComment } from '../../graphql/mutation/posts';
import { usePost } from '../../graphql/query/post';
import { useFollowUser, useHideUser } from '../../graphql/mutation/account';
import type { User } from 'backend/graphql/users.graphql';

interface CommentItemProps {
  user: User;
  body: string;
}

const LIKES = [
  {
    firstName: 'sss',
    lastName: 'ddddd',
    avatar: '3333.png',
    position: 'test',
    company: 'cccc',
  },
  {
    firstName: 'sss',
    lastName: 'ddddd',
    avatar: '3333.png',
    position: 'test',
    company: 'cccc',
  },
];

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
  const [comment, setComment] = useState('');
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const { post, userId } = route.params;
  const { data, refetch } = usePost(post._id);
  const [commentPost] = useCommentPost();
  const [deleteComment] = useDeleteComment();
  const [followUser] = useFollowUser();
  const [hideUser] = useHideUser();
  const comments = data?.post?.comments;

  const getKebobMenuData = useMemo(() => {
    const KebobMenuDataArray = [
      {
        label: `Follow ${selectedUser.firstName} ${selectedUser.lastName}`,
        icon: <UserCirclePlus size={32} color={WHITE} />,
        key: 'follow',
      },
      {
        label: 'Report comment',
        icon: <WarningOctagon size={32} color={WHITE} />,
        key: 'report',
      },
      {
        label: `Hide ${selectedUser.firstName} ${selectedUser.lastName}`,
        icon: <EyeClosed size={32} color={WHITE} />,
        key: 'hide',
      },
    ];

    return KebobMenuDataArray;
  }, [selectedUser]);

  const addComment = async () => {
    try {
      const { data } = await commentPost({
        variables: {
          comment: {
            body: comment,
            postId: post._id,
            mentionIds: [],
          },
        },
      });

      if (data?.comment) {
        setComment('');
        refetch();
      }
    } catch (err) {
      console.log('add comment error:', err);
    }
  };

  const handleDeleteComment = async () => {
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

  const CommentItem = ({ item }: { item: CommentItemProps }) => {
    const { user, body } = item;
    return (
      <View>
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
        <PLabel label={body} viewStyle={styles.sendBtn} />
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => <CommentItem item={item} />,
    [comments?.length],
  );

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
        <FlatList data={comments || []} renderItem={renderItem} />
        <View style={styles.inputContainer}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.input}
          />
          <TouchableOpacity onPress={addComment}>
            <PaperPlaneRight size={32} color={WHITE} />
          </TouchableOpacity>
        </View>
      </PAppContainer>
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
        likes={LIKES}
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    backgroundColor: WHITE,
    padding: 11,
    paddingTop: 11, // important
    minHeight: 36,
    borderRadius: 24,
    width: '90%',
  },
  sendBtn: {
    marginLeft: 40,
  },
});
