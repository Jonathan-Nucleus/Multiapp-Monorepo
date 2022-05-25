import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { WHITE12 } from 'shared/src/colors';

import PostContent from './PostItem/PostContent';
import { PostSummary } from 'shared/graphql/fragments/post';

type Post = PostSummary;
interface SharePostItem {
  post: Post;
  sharedBy: string;
}

const SharePostItem: FC<SharePostItem> = ({ post, sharedBy }) => {
  return (
    <View style={styles.postContainer}>
      <PostContent post={post} sharedBy={sharedBy} hideMenu />
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
