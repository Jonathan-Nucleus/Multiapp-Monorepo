import React, { useState, useEffect, memo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SplashScreen from 'react-native-splash-screen';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import PAppContainer from '../../components/common/PAppContainer';
import MainHeader from '../../components/main/Header';
import pStyles from '../../theme/pStyles';
import PostItem, { PostItemProps } from '../../components/main/PostItem';
import Tag from '../../components/common/Tag';
import PGradientButton from '../../components/common/PGradientButton';
import { HomeScreen } from 'mobile/src/navigations/HomeStack';
import { useFetchPosts } from 'mobile/src/hooks/queries';

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const { data, error, loading, refetch } = useFetchPosts();
  const postData = data?.posts;

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

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderItem = ({ item }: { item: PostItemProps }) => (
    <PostItem post={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader navigation={navigation} />
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
          data={postData || []}
          renderItem={renderItem}
          keyExtractor={(item: PostItemProps) => `${item._id}`}
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
    </View>
  );
};

export const Home = memo(HomeComponent, isEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
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
