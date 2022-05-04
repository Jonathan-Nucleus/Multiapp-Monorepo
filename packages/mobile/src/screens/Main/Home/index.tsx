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
import { useIsFocused } from '@react-navigation/native';
import { SlidersHorizontal } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PostItem, { PostItemProps } from 'mobile/src/components/main/PostItem';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';

import { usePosts, Post } from 'mobile/src/graphql/query/post/usePosts';
import { useAccount } from 'mobile/src/graphql/query/account';

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

  const { data: userData, loading: userLoading } = useAccount();
  const { data, refetch } = usePosts(selectedCategories, selectedRole);

  const account = userData?.account;
  const postData = data?.posts ?? [];

  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  if (isFocused !== focusState) {
    // Refetch whenever the focus state changes to avoid refetching during
    // rerender cycles
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (userLoading || !account) {
    // if show skeleton placeholder whenever loading posts,
    // UX is not good whenever focusing on home tab
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
      params: undefined,
    });
  };

  const postFilter = (role: PostRoleFilter, cateogies: PostCategory[]) => {
    setSelectedRole(role);
    setSelectedCategories(cateogies.length > 0 ? cateogies : undefined);
  };

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostItem
      post={item}
      userId={account._id}
      onPressMenu={() => {
        setSelectedPost(item);
        setKebobMenuVisible(true);
      }}
    />
  );

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
      <PAppContainer style={styles.container}>
        <FlatList
          data={postData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item._id}`}
          listKey="post"
        />
      </PAppContainer>
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
      <UserPostActionModal
        post={selectedPost}
        visible={kebobMenuVisible && selectedPost?.user._id !== account._id}
        onClose={() => setKebobMenuVisible(false)}
      />
      <OwnPostActionModal
        post={selectedPost}
        visible={kebobMenuVisible && selectedPost?.user._id === account._id}
        onClose={() => setKebobMenuVisible(false)}
      />
      <FilterModal
        isVisible={visibleFilter}
        onClose={() => setVisibleFilter(false)}
        onFilter={postFilter}
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
