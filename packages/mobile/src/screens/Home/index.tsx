import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from './Header';
import PAppContainer from '../../components/common/PAppContainer';
import { BGDARK } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';
import FeedItem, { FeedItemProps } from './FeedItem';

interface ScreenProps {
  navigation: any;
}

const FeedItems = [
  {
    name: 'Test1',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user1', 'consumer1'],
    commentCounts: 5,
    shareCounts: 2,
  },
  {
    name: 'Test2',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user2', 'consumer2'],
    commentCounts: 3,
    shareCounts: 12,
  },
];

const Home: React.FC<ScreenProps> = ({ navigation }) => {
  const renderItem = ({ item }: { item: FeedItemProps }) => (
    <FeedItem
      name={item.name}
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
        <FlatList data={FeedItems} renderItem={renderItem} />
      </PAppContainer>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {},
});
