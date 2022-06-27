import React, { useState, memo, useMemo, useCallback } from 'react';
import {
  ListRenderItem,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
  FlatListProps,
} from 'react-native';
import isEqual from 'react-fast-compare';
import { SlidersHorizontal } from 'phosphor-react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import retry from 'async-retry';

import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PostItem from 'mobile/src/components/main/posts/PostItem';
import {
  stopVideos,
  stopVideo,
  isVideo,
} from 'mobile/src/components/common/Media';
import pStyles from 'mobile/src/theme/pStyles';

import { usePosts, Post } from 'shared/graphql/query/post/usePosts';
import { useAccountContext } from 'shared/context/Account';
import { HomeScreen } from 'mobile/src/navigations/MainTabNavigator';
import FilterModal from 'mobile/src/screens/PostDetails/FilterModal';
import PostItemPlaceholder from '../../../components/placeholder/PostItemPlaceholder';
import { WHITE } from 'shared/src/colors';
import type {
  PostCategory,
  PostRoleFilter,
} from 'backend/graphql/posts.graphql';
import { PostRoleFilterOptions } from 'backend/schemas/post';
import { Body2Bold } from '../../../theme/fonts';

const PLACE_HOLDERS = 7;

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<PostCategory[]>();
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentFocus = useIsFocused();
  const [isFocused, setFocused] = useState(currentFocus);
  const account = useAccountContext();
  const {
    data: { posts: postData = [] } = {},
    refetch,
    fetchMore,
    loading,
  } = usePosts(selectedCategories, selectedRole);

  const renderItem: ListRenderItem<Post> = useMemo(
    () =>
      ({ item }) =>
        <PostItem post={item} />,
    [],
  );

  if (isFocused !== currentFocus) {
    setFocused(currentFocus);
    refetch();
    stopVideos();
  }

  const onViewableItemsChanged = useCallback<
    Exclude<FlatListProps<Post>['onViewableItemsChanged'], null | undefined>
  >(({ changed }) => {
    changed.forEach((token) => {
      const item = token.item as Post;
      const hasVideo = isVideo(item.media?.url ?? '');
      if (!token.isViewable && hasVideo) {
        const key = `${item.userId}/${item._id}`;
        stopVideo(key);
      }
    });
  }, []);

  if (loading && postData.length === 0) {
    return (
      <View style={pStyles.globalContainer}>
        <MainHeader />
        {[...Array(PLACE_HOLDERS)].map((_, index) => (
          <PostItemPlaceholder key={index} />
        ))}
      </View>
    );
  }

  const handleCreatePost = (): void => {
    navigation.navigate('PostDetails', {
      screen: 'CreatePost',
      params: {},
    });
  };

  const postFilter = (
    role: PostRoleFilter,
    cateogies: PostCategory[],
  ): void => {
    setSelectedRole(role);
    setSelectedCategories(cateogies.length > 0 ? cateogies : undefined);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await retry(
      async () => {
        return refetch();
      },
      { retries: 5 },
    );
    setRefreshing(false);
  };

  const onEndReached = (): void => {
    console.log('Fetching more posts');
    const lastItem = postData[postData.length - 1]._id;
    fetchMore({
      variables: {
        before: lastItem,
      },
    });
  };

  console.log('postData', postData[0]?.body);

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <View style={styles.row}>
        <Text style={styles.filter}>
          Posts from {PostRoleFilterOptions[selectedRole].label}
        </Text>
        <TouchableOpacity onPress={() => setVisibleFilter(true)}>
          <SlidersHorizontal color={WHITE} size={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        removeClippedSubviews={true}
        contentContainerStyle={styles.container}
        data={postData}
        extraData={isFocused}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReachedThreshold={5}
        onEndReached={onEndReached}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            colors={[WHITE]}
            tintColor={WHITE}
          />
        }
      />

      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
      <FilterModal
        isVisible={visibleFilter}
        onClose={() => setVisibleFilter(false)}
        onFilter={postFilter}
        selectedCategories={selectedCategories}
        role={selectedRole}
      />
    </View>
  );
};

export const Home = memo(HomeComponent, isEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 0,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filter: {
    ...Body2Bold,
    color: WHITE,
  },
});
