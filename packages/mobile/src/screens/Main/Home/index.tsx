import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import {
  ListRenderItem,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
  FlatListProps,
  Dimensions,
  Button,
  Pressable, DeviceEventEmitter,
} from 'react-native';
import isEqual from 'react-fast-compare';
import { SlidersHorizontal } from 'phosphor-react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import retry from 'async-retry';
import Tooltip from 'react-native-walkthrough-tooltip';

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
import AsyncStorage from "@react-native-async-storage/async-storage";

const PLACE_HOLDERS = 7;

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] =
    useState<PostCategory[]>();
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentFocus = useIsFocused();
  const [isFocused, setFocused] = useState(currentFocus);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialOptions, setTutorialOptions] = useState({
    filter: false,
    add: false,
  });
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

  useEffect(() => {
    (async () => {
      const valueFromStorage = await AsyncStorage.getItem('homePageTutorial');
      setTimeout(() => {
        if (!valueFromStorage) {
          DeviceEventEmitter.emit('tabTutorial');
          setShowTutorial(false);
        } else {
          setShowTutorial(false);
        }
      }, 1000);
    })();
  }, [showTutorial]);

  useEffect(() => {
    DeviceEventEmitter.addListener('homeTutorial', () => {
      setTutorialOptions({
        ...tutorialOptions,
        filter: true,
        add: false,
      });
      // do something
      console.log('Hello World! from homeTutorial');
    });
    // emitter.remove();
  });

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

  const showHeaderTutorial = () => {
    DeviceEventEmitter.emit('headerTutorial');
    setTutorialOptions({ ...tutorialOptions, add: false, filter: false});
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <View style={styles.row}>
        <Text style={styles.filter}>
          Posts from {PostRoleFilterOptions[selectedRole].label}
        </Text>
        <Tooltip
          isVisible={tutorialOptions.filter}
          content={
            <View style={pStyles.tooltipContainer}>
              <Text style={pStyles.tooltipText}> Tap here to filter your newsfeed.</Text>
              <Pressable onPress={() => setTutorialOptions({...tutorialOptions, filter: false, add: true}) } style={pStyles.tooltipButton}>
                <Text style={pStyles.tooltipButtonText}>Next</Text>
              </Pressable>
            </View>
          }
          contentStyle={pStyles.tooltipContent}
          placement="left"
          onClose={() => console.log('')}>
          <TouchableOpacity onPress={() => console.log('')}>
            <SlidersHorizontal color={WHITE} size={24} />
          </TouchableOpacity>
        </Tooltip>
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

      <View style={styles.postButton}>
        <Tooltip
            isVisible={tutorialOptions.add}
            content={
              <View style={{...pStyles.tooltipContainer}}>
                <Text style={pStyles.tooltipText}> Tap here to make a new post.</Text>
                <Pressable onPress={() => showHeaderTutorial()} style={pStyles.tooltipButton}>
                  <Text style={pStyles.tooltipButtonText}>Next</Text>
                </Pressable>
              </View>
            }

            contentStyle={pStyles.tooltipContent}
            placement="left"
            onClose={() => console.log('')}>
          <PGradientButton
              label="+"
              gradientContainer={styles.gradientContainer}
              textStyle={styles.postLabel}
              onPress={handleCreatePost}
          />
        </Tooltip>
      </View>

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
