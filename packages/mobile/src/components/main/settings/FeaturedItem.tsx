import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import dayjs from 'dayjs';

import PLabel from '../../common/PLabel';
import Media from '../../common/Media';
import UserInfo from '../../common/UserInfo';
import { WHITE12 } from 'shared/src/colors';

import { Post } from 'mobile/src/graphql/query/post/usePosts';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

interface FeedItemProps {
  post: Post;
  type?: string;
}

const FeaturedItem: React.FC<FeedItemProps> = ({ post }) => {
  const { user, body, mediaUrl } = post;
  const goToDetails = () => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
        userId: user._id,
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

  return (
    <Pressable onPress={goToDetails}>
      <View style={[styles.container]}>
        <Pressable onPress={goToProfile}>
          <View style={styles.headerWrapper}>
            <UserInfo
              user={user}
              avatarSize={56}
              auxInfo={dayjs(post.createdAt).format('MMM D')}
            />
          </View>
        </Pressable>
        {body ? (
          <PLabel
            label={body}
            viewStyle={styles.labelView}
            textStyle={styles.body}
            numberOfLines={2}
          />
        ) : null}
        {mediaUrl ? <Media style={styles.postImage} src={mediaUrl} /> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 16,
    width: 300,
    marginRight: 16,
    borderRadius: 6,
    borderColor: WHITE12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1,
  },
  postImage: {
    width: '100%',
    height: 170,
    marginTop: 16,
  },
  body: {
    lineHeight: 20,
  },
  labelView: {
    paddingHorizontal: 16,
  },
});

export default FeaturedItem;
