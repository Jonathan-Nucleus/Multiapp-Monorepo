import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import Header from './Header';
import PAppContainer from '../../components/common/PAppContainer';
import { BGDARK } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';
import FeedItem, { FeedItemProps } from './FeedItem';
import Tag from '../../components/common/Tag';
import PGradientButton from '../../components/common/PGradientButton';

interface ScreenProps {
  navigation: any;
}

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const FeedItems = [
  {
    name: 'Michelle Jordan',
    company: 'HedgeFunds',
    date: 'Mar 30',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user1', 'consumer1'],
    commentCounts: 5,
    shareCounts: 2,
  },
  {
    name: 'Michelle Jordan',
    company: 'HedgeFunds',
    date: 'Mar 30',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user2', 'consumer2'],
    commentCounts: 3,
    shareCounts: 12,
  },
];

const Home: React.FC<ScreenProps> = ({ navigation }) => {
  const [category, setCategory] = useState('All');

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderItem = ({ item }: { item: FeedItemProps }) => (
    <FeedItem
      name={item.name}
      company={item.company}
      date={item.date}
      description={item.description}
      tags={item.tags}
      commentCounts={item.commentCounts}
      shareCounts={item.shareCounts}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <Header />
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
        <FlatList data={FeedItems} renderItem={renderItem} listKey="feed" />
      </PAppContainer>
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
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
    bottom: 0,
    right: 22,
    width: 56,
    height: 56,
    paddingVertical: 0,
  },
  postLabel: {
    fontSize: 40,
    textAlign: 'center',
  },
});
