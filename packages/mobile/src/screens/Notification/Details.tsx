import React from 'react';
import { Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BGDARK, WHITE } from 'shared/src/colors';

import PostItem, { Post } from '../../components/main/PostItem';
import PHeader from '../../components/common/PHeader';
import RoundIcon from '../../components/common/RoundIcon';

import { Body1 } from '../../theme/fonts';
import pStyles from '../../theme/pStyles';
import SearchSvg from '../../assets/icons/search.svg';
import BackSvg from '../../assets/icons/back.svg';

import type { NotificationDetailsScreen } from 'mobile/src/navigations/HomeStack';
import { usePost } from 'mobile/src/graphql/query/post';

const NotificationDetail: NotificationDetailsScreen = ({
  navigation,
  route,
}) => {
  const { postId, userId } = route.params;
  const { data: postData } = usePost(postId);

  const posts = postData?.post ? [postData.post] : [];
  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostItem
      post={item}
      userId={userId}
      onPressMenu={() => console.log('pressed menu')}
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
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
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
