import React, { FC, useRef, useState, useEffect, memo } from 'react';
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
  Pressable,
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

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import {
  useCommentPost,
  useDeleteComment,
  useEditCommentPost,
  useLikeComment,
} from 'shared/graphql/mutation/posts';
import { usePost, Comment } from 'shared/graphql/query/post/usePost';
import { useHideUser } from 'shared/graphql/mutation/account';
import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useAccount } from 'shared/graphql/query/account/useAccount';

import UserCommentActionModal from './UserCommentActionModal';
import OwnCommentActionModal from './OwnCommentActionModal';

type CommentUser = Comment['user'];

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onReply, onEdit }) => {
  const { _id, commentId, user, body, createdAt } = comment;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  const [likeComment] = useLikeComment();
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [kebobIsClosing, setKebobIsClosing] = useState(false);

  const isMyComment = user._id === account?._id;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  useEffect(() => {
    if (liked === undefined && account) {
      setLiked((account && comment.likeIds?.includes(account._id)) ?? false);
    }
  }, [account]);

  const closeKebobMenu = () => {
    setKebobIsClosing(true);
    setKebobMenuVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setKebobIsClosing(false), 500);
  };

  const commentItemContainer = {
    marginLeft: commentId ? 32 : 0,
  };

  const toggleLike = async () => {
    const toggled = !liked;
    const { data } = await likeComment({
      variables: { like: toggled, commentId: comment._id },
    });

    data && data.likeComment
      ? setLiked(toggled)
      : console.log('Error liking comment');
  };

  const goToProfile = () => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: user._id,
      },
    });
  };

  return (
    <View style={commentItemContainer}>
      <View style={styles.userItemContainer}>
        <Pressable onPress={goToProfile}>
          <UserInfo
            user={user}
            avatarSize={32}
            viewStyle={styles.userInfoContainer}
          />
        </Pressable>
        <TouchableOpacity onPress={() => setKebobMenuVisible(true)}>
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
              onReply?.(comment);
            }}>
            <PLabel label="Reply" textStyle={styles.smallLabel} />
          </TouchableOpacity>
        )}
      </View>
      {(kebobMenuVisible || kebobIsClosing) &&
        (isMyComment ? (
          <OwnCommentActionModal
            comment={comment}
            visible={kebobMenuVisible}
            onClose={closeKebobMenu}
            onEditComment={() => onEdit?.(comment)}
          />
        ) : (
          <UserCommentActionModal
            comment={comment}
            visible={kebobMenuVisible}
            onClose={closeKebobMenu}
          />
        ))}
    </View>
  );
};

export default memo(CommentItem);

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
