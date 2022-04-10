import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';
import SplashScreen from 'react-native-splash-screen';

import Header from '../../components/main/Header';
import PAppContainer from '../../components/common/PAppContainer';
import pStyles from '../../theme/pStyles';
import FeedItem, { FeedItemProps } from './FeedItem';
import Tag from '../../components/common/Tag';
import PGradientButton from '../../components/common/PGradientButton';
import { GET_POSTS } from '../../graphql/post';
import { HomeScreen } from 'mobile/src/navigations/HomeStack';

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const Home: HomeScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const [refreshList, setRefreshList] = useState(false);
  const { data, error, loading } = useQuery(GET_POSTS);
  const postData = data?.posts;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderItem = ({ item }: { item: FeedItemProps }) => (
    <FeedItem
      name={`${item.user?.firstName} ${item.user?.lastName}`}
      company={item.company || 'Company'}
      date={item.date}
      mediaUrl={item.mediaUrl}
      body={item.body}
      categories={item.categories || []}
      commentCounts={item.commentCounts || 0}
      shareCounts={item.shareCounts || 0}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <Header navigation={navigation} />
      <PAppContainer>
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
          extraData={refreshList}
          keyExtractor={(item: FeedItemProps) => `${item._id}`}
          listKey="feed"
        />
      </PAppContainer>
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
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
