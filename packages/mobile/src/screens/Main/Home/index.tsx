import React, { useState, useEffect, memo, useMemo } from 'react';
import {
  ListRenderItem,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import isEqual from 'react-fast-compare';
import SplashScreen from 'react-native-splash-screen';
import { SlidersHorizontal } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PostItem from 'mobile/src/components/main/PostItem';
import pStyles from 'mobile/src/theme/pStyles';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';

import { usePosts, Post } from 'shared/graphql/query/post/usePosts';
import { useAccount } from 'shared/graphql/query/account';
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
  const [selectedCategories, setSelectedCategories] = useState<
    PostCategory[] | undefined
  >(undefined);
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);

  const { data: userData } = useAccount();
  const {
    data,
    loading: postsLoading,
    refetch,
  } = usePosts(selectedCategories, selectedRole);

  const account = userData?.account;
  const postData = data?.posts ?? [];

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (!postData || !account) {
    return (
      <View style={pStyles.globalContainer}>
        <MainHeader />
        {[...Array(PLACE_HOLDERS)].map(() => (
          <PostItemPlaceholder />
        ))}
      </View>
    );
  }

  const handleCreatePost = () => {
    navigation.navigate('PostDetails', {
      screen: 'CreatePost',
      params: {},
    });
  };

  const handleEditPost = () => {
    if (!selectedPost) return;
    navigation.navigate('PostDetails', {
      screen: 'CreatePost',
      params: {
        post: selectedPost,
      },
    });
  };

  const postFilter = (role: PostRoleFilter, cateogies: PostCategory[]) => {
    setSelectedRole(role);
    setSelectedCategories(cateogies.length > 0 ? cateogies : undefined);
  };

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostItem
      post={item}
      onPressMenu={() => {
        setSelectedPost(item);
        setKebobMenuVisible(true);
      }}
    />
  );

  const myPost =
    (selectedPost &&
      (selectedPost.userId === account._id ||
        account.companyIds?.includes(selectedPost.userId))) ??
    false;

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
        contentContainerStyle={styles.container}
        data={postData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
      <UserPostActionModal
        post={selectedPost}
        visible={kebobMenuVisible && !myPost}
        onClose={() => setKebobMenuVisible(false)}
      />
      <OwnPostActionModal
        post={selectedPost}
        visible={kebobMenuVisible && myPost}
        onClose={() => setKebobMenuVisible(false)}
        onEditPost={() => handleEditPost()}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filter: {
    ...Body2Bold,
    color: WHITE,
  },
});
