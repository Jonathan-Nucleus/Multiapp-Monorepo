import React, { FC } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { WHITE12 } from 'shared/src/colors';

import PostContent from './PostItem/PostContent';
import { PostSummary } from 'shared/graphql/fragments/post';

const DEVICE_WIDTH = Dimensions.get('window').width;

type Post = PostSummary;
interface SharePostItemProps {
  post: Post;
  onPress?: () => void;
}

const SharePostItem: FC<SharePostItemProps> = ({ post, onPress }) => {
  return (
    <View style={styles.postContainer}>
      <PostContent
        post={post}
        hideMenu
        itemWidth={DEVICE_WIDTH - 66}
        onPress={onPress}
      />
    </View>
  );
};

export default SharePostItem;

const styles = StyleSheet.create({
  postContainer: {
    borderColor: WHITE12,
    borderWidth: 1,
    borderRadius: 16,
  },
});
