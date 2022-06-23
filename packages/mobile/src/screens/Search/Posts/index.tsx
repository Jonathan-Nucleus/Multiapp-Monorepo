import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { SlidersHorizontal } from 'phosphor-react-native';

import { WHITE, WHITE60 } from 'shared/src/colors';
import { Body2Bold } from '../../../theme/fonts';

import PostItem from 'mobile/src/components/main/posts/PostItem';
import { Post } from 'shared/graphql/query/post/usePosts';
import type {
  PostCategory,
  PostRoleFilter,
} from 'backend/graphql/posts.graphql';
import { PostRoleFilterOptions } from 'backend/schemas/post';

import FilterModal from 'mobile/src/screens/PostDetails/FilterModal';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import pStyles from 'mobile/src/theme/pStyles';

interface PostProps {
  posts: Post[];
  search: string;
}

const Posts: React.FC<PostProps> = ({ posts, search }: PostProps) => {
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    PostCategory[] | undefined
  >(undefined);
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');
  const { data: accountData } = useAccount();
  const account = accountData?.account;

  const allPosts = useMemo(() => {
    if (selectedCategories && selectedCategories?.length > 0) {
      const filteredPosts = posts.filter((v) =>
        v.categories.some((c) => selectedCategories.includes(c)),
      );
      if (selectedRole !== 'EVERYONE') {
        return filteredPosts.filter((v) => v.user?.role === 'PROFESSIONAL');
      }
      return filteredPosts;
    } else {
      if (selectedRole !== 'EVERYONE') {
        return posts.filter((v) => v.user?.role === 'PROFESSIONAL');
      }
      return posts;
    }
  }, [posts, selectedCategories, selectedRole]);

  const postFilter = (role: PostRoleFilter, cateogies: PostCategory[]) => {
    setSelectedRole(role);
    setSelectedCategories(cateogies.length > 0 ? cateogies : undefined);
  };

  if (!account) {
    return <View style={pStyles.globalContainer} />;
  }

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostItem post={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {allPosts.length} results for "{search}" in Posts
        </Text>
      )}
      {posts.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.filter}>
            Posts from {PostRoleFilterOptions[selectedRole].label}
          </Text>
          <TouchableOpacity onPress={() => setVisibleFilter(true)}>
            <SlidersHorizontal color={WHITE} size={24} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={allPosts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
      <FilterModal
        isVisible={visibleFilter}
        onClose={() => setVisibleFilter(false)}
        onFilter={postFilter}
      />
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 0,
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    borderRadius: 4,
  },
  tagLabel: {
    textTransform: 'none',
  },
  postButton: {
    position: 'absolute',
    bottom: 22,
    right: 22,
  },
  gradientContainer: {
    width: 56,
    height: 56,
    paddingVertical: 0,
  },
  postLabel: {
    fontSize: 40,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  filter: {
    ...Body2Bold,
    color: WHITE,
  },
  alert: {
    color: WHITE60,
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
