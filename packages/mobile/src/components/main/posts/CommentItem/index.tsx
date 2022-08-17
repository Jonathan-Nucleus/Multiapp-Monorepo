import React, { FC, useRef, useState, useEffect, memo } from 'react';
import { StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import moment from 'moment';
import { DotsThreeVertical } from 'phosphor-react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import PBodyText from 'mobile/src/components/common/PBodyText';
import UserInfo from 'mobile/src/components/common/UserInfo';
import { PRIMARY, WHITE } from 'shared/src/colors';
import { Body3 } from 'mobile/src/theme/fonts';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import { useLikeComment } from 'shared/graphql/mutation/posts';
import { Comment } from 'shared/graphql/query/post/usePost';
import { useAccount } from 'shared/graphql/query/account/useAccount';

import UserCommentActionModal from './UserCommentActionModal';
import OwnCommentActionModal from './OwnCommentActionModal';

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onReply, onEdit }) => {
  const { commentId, user, body, createdAt } = comment;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
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
  }, [account, comment.likeIds, liked]);

  const closeKebobMenu = (): void => {
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

  const toggleLike = async (): Promise<void> => {
    const toggled = !liked;
    const { data } = await likeComment({
      variables: { like: toggled, commentId: comment._id },
    });

    data && data.likeComment
      ? setLiked(toggled)
      : console.log('Error liking comment');
  };

  const goToProfile = (): void => {
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
      <PBodyText
        style={styles.bodyContent}
        body={body}
        collapseLongText={false}
        hideLinkPreview={true}
      />
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
  userItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    paddingVertical: 12,
  },
  bodyContent: {
    marginLeft: 40,
  },
  actionContainer: {
    marginLeft: 32,
    flexDirection: 'row',
    marginBottom: 8,
  },
  smallLabel: {
    ...Body3,
    marginRight: 8,
    padding: 8,
  },
  likedLabel: {
    color: PRIMARY,
  },
});
