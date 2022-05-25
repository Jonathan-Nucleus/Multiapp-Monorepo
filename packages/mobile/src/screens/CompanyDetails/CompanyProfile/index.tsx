import React, { useMemo, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PostItem from 'mobile/src/components/main/posts/PostItem';
import FeaturedItem from 'mobile/src/components/main/settings/FeaturedItem';
import Members from 'mobile/src/components/main/settings/Members';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import NoPostSvg from 'shared/assets/images/no-post.svg';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, Body3, H5Bold, H6Bold } from 'mobile/src/theme/fonts';
import { WHITE, GRAY100, PRIMARY, PRIMARYSOLID } from 'shared/src/colors';

import CompanyDetail from './CompanyDetail';
import Funds from 'mobile/src/components/main/Funds';
import ProfilePlaceholder from '../../../components/placeholder/ProfilePlaceholder';
import PostItemPlaceholder from 'mobile/src/components/placeholder/PostItemPlaceholder';

import { Post } from 'shared/graphql/query/post/usePosts';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import { useCompany } from 'shared/graphql/query/company/useCompany';
import { useFunds } from 'shared/graphql/query/company/useFunds';
import { usePosts } from 'shared/graphql/query/company/usePosts';
import { useFeaturedPosts } from 'shared/graphql/query/company/useFeaturedPosts';

import { CompanyProfileScreen } from 'mobile/src/navigations/CompanyDetailsStack';

const PLACE_HOLDERS = 4;

const CompanyProfile: CompanyProfileScreen = ({ navigation, route }) => {
  const { companyId } = route.params;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { data: companyData } = useCompany(companyId);
  const { data: fundsData } = useFunds(companyId);
  const { data: postsData, refetch } = usePosts(companyId);
  const { data: featuredPostsData } = useFeaturedPosts(companyId);
  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  const funds = fundsData?.companyProfile?.funds ?? [];
  const posts = postsData?.companyProfile?.posts;
  const featuredPosts = featuredPostsData?.companyProfile?.posts ?? [];
  const company = companyData?.companyProfile;

  const isMyCompany = useMemo(() => {
    if (route.params?.companyId && account?.companies) {
      const index = account?.companies.findIndex(
        (item) => item._id === route.params?.companyId,
      );
      return index > -1;
    }
    return false;
  }, [account, route.params]);

  if (isFocused !== focusState) {
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  if (!company || !account) {
    return (
      <View style={pStyles.globalContainer}>
        <MainHeader
          leftIcon={
            <View style={styles.backIcon}>
              <CaretLeft color={WHITE} />
            </View>
          }
          onPressLeft={() => navigation.goBack()}
        />
        <ProfilePlaceholder variant="company" />
      </View>
    );
  }

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PostDetails', {
          screen: 'PostDetail',
          params: { postId: item._id, userId: account?._id },
        });
      }}>
      <FeaturedItem post={item} />
    </TouchableOpacity>
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.backIcon}>
            <CaretLeft color={WHITE} />
          </View>
        }
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer style={styles.container}>
        <CompanyDetail company={company} isMyCompany={isMyCompany} />
        {account ? (
          <Funds funds={funds} accredited={account.accreditation} />
        ) : null}
        <View>
          <Members members={company.members || []} key={company._id} />
          {featuredPosts.length > 0 ? (
            <View>
              <Text style={styles.text}>Featured Posts</Text>
              <FlatList
                data={featuredPosts}
                renderItem={renderItem}
                keyExtractor={(item) => `${item._id}`}
                listKey="post"
                horizontal
              />
            </View>
          ) : (
            isMyCompany &&
            posts &&
            posts.length > 0 && (
              <>
                <Text style={styles.text}>Featured Posts</Text>
                <View style={styles.noPostContainer}>
                  <Text style={styles.noPostsText}>
                    You don’t have any featured posts, yet.
                  </Text>
                </View>
              </>
            )
          )}

          <View style={styles.allPosts}>
            {posts && posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={(item) => `${item._id}`}
                listKey="post"
                ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
              />
            ) : !posts ? (
              [...Array(PLACE_HOLDERS)].map((_, index) => (
                <PostItemPlaceholder key={index} />
              ))
            ) : (
              isMyCompany && (
                <View style={styles.noPostContainer}>
                  <View style={styles.noPostContainer}>
                    <NoPostSvg />
                  </View>
                  <Text style={styles.noPostsText}>
                    You don’t have any posts, yet.
                  </Text>
                  <PGradientOutlineButton
                    label="Create a Post"
                    btnContainer={styles.createPostBtn}
                    onPress={() =>
                      navigation.navigate('PostDetails', {
                        screen: 'CreatePost',
                        params: {},
                      })
                    }
                  />
                </View>
              )
            )}
          </View>
        </View>
      </PAppContainer>
    </View>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  backIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 0,
    marginBottom: 36,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },
  noPostsText: {
    marginTop: 16,
    marginBottom: 24,
    color: WHITE,
    textAlign: 'center',
    lineHeight: 24,
    ...H6Bold,
  },
  verticalLine: {
    height: 32,
    backgroundColor: GRAY100,
    width: 1,
    marginLeft: 40,
    marginRight: 20,
  },
  website: {
    color: PRIMARY,
    ...Body3,
  },
  text: {
    color: WHITE,
    ...Body2Bold,
    marginTop: 2,
    marginBottom: 8,
  },
  allPosts: {
    paddingTop: 16,
  },
  noPostContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  createPostBtn: {
    marginTop: 25,
  },
  noAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAvatar: {
    color: PRIMARYSOLID,
    ...H5Bold,
  },
});
