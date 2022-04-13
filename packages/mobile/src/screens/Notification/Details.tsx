import React from 'react';
import { Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BGDARK, WHITE } from 'shared/src/colors';

import PostItem, { PostItemProps } from '../../components/main/PostItem';
import PHeader from '../../components/common/PHeader';
import RoundIcon from '../../components/common/RoundIcon';

import { Body1 } from '../../theme/fonts';
import pStyles from '../../theme/pStyles';
import SearchSvg from '../../assets/icons/search.svg';
import BackSvg from '../../assets/icons/back.svg';

import type { NotificationDetailsScreen } from 'mobile/src/navigations/NotificationStack';

const PostItems = [
  {
    name: 'Test1',
    company: 'Test Company',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user1', 'consumer1'],
    commentCounts: 5,
    shareCounts: 2,
    date: 'Mar 29',
  },
  {
    name: 'Test2',
    company: 'Test Company 2',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more Read More..',
    tags: ['user2', 'consumer2'],
    commentCounts: 3,
    shareCounts: 12,
    date: 'Mar 30',
  },
];

const NotificationDetail: NotificationDetailsScreen = ({ navigation }) => {
  const renderItem: ListRenderItem<PostItemProps> = ({ item }) => (
    <PostItem
      name={item.name}
      company={item.company}
      description={item.description}
      tags={item.tags}
      commentCounts={item.commentCounts}
      shareCounts={item.shareCounts}
      date={item.date}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <RoundIcon icon={<BackSvg />} onPress={() => navigation.goBack()} />
        }
        centerIcon={
          <Text style={styles.headerTitle}>Richard Branson’s Post</Text>
        }
        rightIcon={
          <RoundIcon icon={<SearchSvg />} onPress={() => navigation.goBack()} />
        }
        containerStyle={styles.headerContainer}
      />
      <FlatList data={PostItems} renderItem={renderItem} />
    </SafeAreaView>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
  },
});
