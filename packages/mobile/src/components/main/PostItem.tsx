import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import {
  LinkPreview,
  PreviewDataImage,
} from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import {
  ThumbsUp,
  ChatCenteredText,
  Share as ShareIcon,
  DotsThreeVertical,
} from 'phosphor-react-native';
import Share from 'react-native-share';

import PLabel from '../common/PLabel';
import IconButton from '../common/IconButton';
import UserInfo from '../common/UserInfo';
import Tag from '../common/Tag';
import Media from '../common/Media';
import {
  PRIMARYSTATE,
  WHITE12,
  WHITE60,
  WHITE,
  BLACK,
} from 'shared/src/colors';
import { Body1, Body2Bold, Body3 } from '../../theme/fonts';
import * as NavigationService from '../../services/navigation/NavigationService';
import { Post } from 'mobile/src/graphql/query/post/usePosts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';
import { useLikePost } from '../../graphql/mutation/posts';
import { showMessage } from '../../services/utils';
import { appWidth } from '../../utils/utils';

export interface PostItemProps {
  post: Post;
  userId: string; // User id of the currently authenticated user
  onPressMenu?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, userId, onPressMenu }) => {
  const { user, body, mediaUrl } = post;
  const [liked, setLiked] = useState(false);
  const [likePost] = useLikePost();

  useEffect(() => {
    setLiked(post.likeIds?.includes(userId) ?? false);
  }, [post, userId]);

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

  const goToDetails = () => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
        userId,
      },
    });
  };

  const goToProfile = () => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: post.user._id,
      },
    });
  };

  const onShare = async () => {
    try {
      const result = await Share.open({
        title: 'Join me on Prometheus Alts!',
        message: 'Share post item',
        url: 'prometheusalts.com',
      });
      console.log('result', result);
      showMessage('success', 'You shared post succesfully');
    } catch (err) {
      console.log(err);
      showMessage('error', (err as Error).message);
    }
  };

  return (
    <Pressable onPress={goToDetails}>
      <View style={styles.container}>
        <View style={[styles.headerWrapper, styles.contentPadding]}>
          <Pressable onPress={goToProfile}>
            <UserInfo
              user={user}
              avatarSize={56}
              auxInfo={dayjs(post.createdAt).format('MMM D')}
            />
          </Pressable>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => onPressMenu?.()}>
            <DotsThreeVertical size={24} color={WHITE} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentPadding}>
          {body ? (
            <LinkPreview
              containerStyle={styles.previewContainer}
              renderText={(txt) => (
                <PLabel label={txt} textStyle={styles.body} />
              )}
              renderImage={(img: PreviewDataImage) => (
                <FastImage
                  source={{ uri: img.url }}
                  style={styles.previewImage}
                />
              )}
              renderTitle={(txt) => (
                <PLabel label={txt} textStyle={Body2Bold} />
              )}
              renderDescription={(txt) => (
                <PLabel label={txt} textStyle={styles.body} />
              )}
              textContainerStyle={styles.previewTextContainer}
              text={body}
            />
          ) : null}
          {mediaUrl ? <Media src={mediaUrl} /> : null}
        </View>
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
              <PLabel
                label={`${post.likeIds.length} ${
                  post.likeIds.length === 1 ? 'Like' : 'Likes'
                }`}
                textStyle={styles.smallLabel}
              />
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
            onPress={() => toggleLike()}
          />
          <IconButton
            icon={<ChatCenteredText color={WHITE60} size={20} />}
            label="Comment"
            onPress={goToDetails}
          />
          <IconButton
            icon={<ShareIcon color={WHITE60} size={20} />}
            label="Share"
            onPress={onShare}
          />
        </View>
        <View style={styles.divider} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  menuContainer: {
    marginTop: 12,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  previewContainer: {
    backgroundColor: BLACK,
    overflow: 'hidden',
  },
  previewTextContainer: {
    marginHorizontal: 5,
  },
  previewImage: {
    width: appWidth - 36,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  nameLabel: {
    ...Body1,
  },
  smallLabel: {
    ...Body3,
    color: WHITE60,
    marginLeft: 4,
  },
  body: {
    lineHeight: 20,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tagWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  tagStyle: {
    marginRight: 8,
    marginBottom: 8,
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  divider: {
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    marginTop: 24,
  },
  bottomWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PostItem;
