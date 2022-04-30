import React, { useState, useEffect, memo, useMemo } from 'react';
import { ListRenderItem, FlatList, StyleSheet, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SplashScreen from 'react-native-splash-screen';
import { useIsFocused } from '@react-navigation/native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import SelectionModal from 'mobile/src/components/common/SelectionModal';
import Tag from 'mobile/src/components/common/Tag';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PostItem, { PostItemProps } from 'mobile/src/components/main/PostItem';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';

import { usePosts, Post } from 'mobile/src/graphql/query/post/usePosts';
import { useAccount } from 'mobile/src/graphql/query/account';

import { HomeScreen } from 'mobile/src/navigations/MainTabNavigator';

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);

  const { data: userData } = useAccount();
  const { data, error, loading, refetch } = usePosts();

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

  if (!account) {
    return (
      <View style={pStyles.globalContainer}>
        <MainHeader />
      </View>
    );
  }

  const handleCreatePost = () => {
    navigation.navigate('PostDetails', {
      screen: 'CreatePost',
      params: undefined,
    });
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
      <PAppContainer style={styles.container}>
        <FlatList
          horizontal
          data={CategoryList}
          renderItem={({ item }) => (
            <Tag
              label={item}
              viewStyle={styles.tagStyle}
              textStyle={styles.tagLabel}
              isSelected={item === category}
              onPress={setCategory}
            />
          )}
          listKey="category"
        />
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
});
