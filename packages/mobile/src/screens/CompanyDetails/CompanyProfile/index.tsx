import React, { useMemo } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PostItem from 'mobile/src/components/main/posts/PostItem';
import FeaturedItem from 'mobile/src/components/main/settings/FeaturedItem';
import Members from 'mobile/src/components/main/funds/TeamList';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import NoPostSvg from 'shared/assets/images/no-post.svg';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, H6Bold } from 'mobile/src/theme/fonts';
import { WHITE } from 'shared/src/colors';

import CompanyDetail from './CompanyDetail';
import FundList from 'mobile/src/components/main/funds/FundList';
import ProfilePlaceholder from '../../../components/placeholder/ProfilePlaceholder';
import PostItemPlaceholder from 'mobile/src/components/placeholder/PostItemPlaceholder';
import { stopVideos } from 'mobile/src/components/common/Attachment';

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
  const { data: postsData } = usePosts(companyId);
  const { data: featuredPostsData } = useFeaturedPosts(companyId);

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

  useFocusEffect(() => () => {
    stopVideos();
  });

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
        {!company && <ProfilePlaceholder variant="company" />}
      </View>
    );
  }

  const funds = (fundsData?.companyProfile?.funds ?? []).map((fund) => ({
    ...fund,
    company,
  }));

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
    <SafeAreaView style={pStyles.globalContainer} edges={['bottom']}>
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
          <FundList funds={funds} accredited={account.accreditation} />
        ) : null}
        <View>
          {!company.isChannel ? <Members team={company.members || []} /> : null}
          <View style={styles.profileSection}>
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
          </View>
          <View style={styles.profileSection}>
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
    </SafeAreaView>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  profileSection: {
    marginTop: 16,
  },
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
  noPostsText: {
    marginTop: 16,
    marginBottom: 24,
    color: WHITE,
    textAlign: 'center',
    lineHeight: 24,
    ...H6Bold,
  },
  text: {
    color: WHITE,
    ...Body2Bold,
    marginTop: 2,
    marginBottom: 8,
  },
  noPostContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  createPostBtn: {
    marginTop: 25,
  },
});
