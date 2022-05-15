import React from 'react';
import { Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BGDARK, WHITE } from 'shared/src/colors';

import PostItem from 'mobile/src/components/main/PostItem';
import PHeader from 'mobile/src/components/common/PHeader';
import RoundIcon from 'mobile/src/components/common/RoundIcon';
import { Body1 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import SearchSvg from 'mobile/src/assets/icons/search.svg';
import BackSvg from 'mobile/src/assets/icons/back.svg';

import { usePost } from 'shared/graphql/query/post/usePost';
import { Post } from 'shared/graphql/query/post/usePosts';

import type { NotificationDetailsScreen } from 'mobile/src/navigations/AppNavigator';

const NotificationDetail: NotificationDetailsScreen = ({
  navigation,
  route,
}) => {
  const { postId } = route.params;
  const { data: postData } = usePost(postId);

  const posts = postData?.post ? [postData.post] : [];
  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <PostItem post={item} />
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
