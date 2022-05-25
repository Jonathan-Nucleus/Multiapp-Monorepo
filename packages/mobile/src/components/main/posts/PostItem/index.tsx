import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import {
  ThumbsUp,
  ChatCenteredText,
  Share as ShareIcon,
} from 'phosphor-react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import IconButton from 'mobile/src/components/common/IconButton';
import Tag from 'mobile/src/components/common/Tag';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { PRIMARYSTATE, WHITE12, WHITE60 } from 'shared/src/colors';
import { Body3 } from 'mobile/src/theme/fonts';

import PostContent from './PostContent';
import LikesModal from './LikesModal';

import { Post } from 'shared/graphql/query/post/usePosts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import { useLikePost } from 'shared/graphql/mutation/posts/useLikePost';

export interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const { isLiked, toggleLike, likeCount } = useLikePost(post._id);

  const goToDetails = (comment?: boolean): void => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
        focusComment: comment,
      },
    });
  };

  const sharePost = (): void => {
    NavigationService.navigate('PostDetails', {
      screen: 'SharePost',
      params: {
        sharePostId: post._id,
      },
    });
  };

  return (
    <>
      <Pressable onPress={() => goToDetails()}>
        <View style={styles.container}>
          <PostContent post={post} />
          <View style={[styles.postInfo, styles.contentPadding]}>
            <View style={styles.tagWrapper}>
              {post.categories.map((item, index) => (
                <React.Fragment key={item}>
                  <Tag
                    label={PostCategories[item]}
                    viewStyle={styles.tagStyle}
                  />
                  {index < post.categories.length - 1 ? (
                    <Text style={styles.tagSeparator}>•</Text>
                  ) : null}
                </React.Fragment>
              ))}
            </View>
            <View style={styles.otherInfo}>
              {likeCount > 0 && (
                <Pressable
                  onPress={() => setLikesModalVisible(true)}
                  style={({ pressed }) =>
                    pressed ? pStyles.pressedStyle : {}
                  }>
                  <PLabel
                    label={`${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}`}
                    textStyle={styles.smallLabel}
                  />
                </Pressable>
              )}
              {post.commentIds && post.commentIds.length > 0 && (
                <PLabel
                  label={`${post.commentIds.length} ${
                    post.commentIds.length === 1 ? 'Comment' : 'Comments'
                  }`}
                  textStyle={styles.smallLabel}
                />
              )}
              {post.shareIds && post.shareIds.length > 0 && (
                <PLabel
                  label={`${post.shareIds.length} ${
                    post.shareIds.length === 1 ? 'Share' : 'Shares'
                  }`}
                  textStyle={styles.smallLabel}
                />
              )}
            </View>
          </View>
          <View style={[styles.bottomWrapper, styles.contentPadding]}>
            <IconButton
              icon={
                <ThumbsUp
                  weight={isLiked ? 'fill' : 'light'}
                  color={isLiked ? PRIMARYSTATE : WHITE60}
                  size={20}
                />
              }
              label="Like"
              onPress={toggleLike}
            />
            <IconButton
              icon={<ChatCenteredText color={WHITE60} size={20} />}
              label="Comment"
              onPress={() => goToDetails(true)}
            />
            <IconButton
              icon={<ShareIcon color={WHITE60} size={20} />}
              label="Share"
              onPress={sharePost}
            />
          </View>
          <View style={styles.divider} />
        </View>
      </Pressable>
      <LikesModal
        likes={post.likes}
        isVisible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  smallLabel: {
    ...Body3,
    marginTop: 4,
    marginLeft: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagStyle: {
    marginRight: 4,
    backgroundColor: 'transparent',
  },
  tagSeparator: {
    color: WHITE60,
    marginRight: 4,
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    marginTop: 24,
  },
});

export default PostItem;
