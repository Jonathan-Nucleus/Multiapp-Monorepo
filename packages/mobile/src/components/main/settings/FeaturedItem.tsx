import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import dayjs from 'dayjs';

import PLabel from '../../common/PLabel';
import Media from '../../common/Media';
import UserInfo from '../../common/UserInfo';
import { WHITE12 } from 'shared/src/colors';

import { Post } from 'shared/graphql/query/post/usePosts';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

interface FeedItemProps {
  post: Post;
  type?: string;
}

const FeaturedItem: React.FC<FeedItemProps> = ({ post }) => {
  const { user, company, body, media } = post;
  const goToDetails = (): void => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
      },
    });
  };

  const goToProfile = (): void => {
    if (user) {
      NavigationService.navigate('UserDetails', {
        screen: 'UserProfile',
        params: {
          userId: user._id,
        },
      });
    } else if (company) {
      NavigationService.navigate('CompanyDetails', {
        screen: 'CompanyProfile',
        params: {
          companyId: company._id,
        },
      });
    }
  };

  return (
    <Pressable onPress={goToDetails}>
      <View style={[styles.container]}>
        <Pressable onPress={goToProfile}>
          <View style={styles.headerWrapper}>
            <UserInfo
              user={user || company}
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
        {media ? (
          <Media mediaId={post._id} style={styles.postImage} media={media} />
        ) : null}
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
