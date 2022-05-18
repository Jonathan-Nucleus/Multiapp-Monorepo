import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
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
import { PRIMARYSTATE, WHITE12, WHITE60, PRIMARY } from 'shared/src/colors';
import { Body3 } from 'mobile/src/theme/fonts';

import PostContent from './PostContent';
import LikesModal from './LikesModal';

import { Post } from 'shared/graphql/query/post/usePosts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import { useLikePost } from 'shared/graphql/mutation/posts';

export interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { likes } = post;
  const [liked, setLiked] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [likePost] = useLikePost();

  const toggleLike = async (): Promise<void> => {
    const toggled = !liked;
    try {
      const { data: postData } = await likePost({
        variables: { like: toggled, postId: post._id },
      });

      postData && postData.likePost
        ? setLiked(toggled)
        : console.log('Error liking post');
    } catch (err) {
      console.log('Error liking post', err);
    }
  };

  const goToDetails = (comment?: boolean) => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
        focusComment: comment,
      },
    });
  };

  const sharePost = () => {
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
              {post.categories.map((item) => (
                <Tag
                  label={PostCategories[item]}
                  viewStyle={styles.tagStyle}
                  key={item}
                />
              ))}
            </View>
            <View style={styles.otherInfo}>
              {post.likeIds && post.likeIds.length > 0 && (
                <Pressable
                  onPress={() => setLikesModalVisible(true)}
                  style={({ pressed }) =>
                    pressed ? pStyles.pressedStyle : {}
                  }>
                  <PLabel
                    label={`${post.likeIds.length} ${
                      post.likeIds.length === 1 ? 'Like' : 'Likes'
                    }`}
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
                  weight={liked ? 'fill' : 'light'}
                  color={liked ? PRIMARYSTATE : WHITE60}
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
        likes={likes}
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
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  smallLabel: {
    ...Body3,
    marginRight: 8,
    padding: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  tagStyle: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: WHITE12,
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
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
