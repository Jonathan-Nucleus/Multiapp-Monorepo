import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  useIsFocused,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import {
  WHITE,
  WHITE12,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
  PRIMARYSOLID,
} from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import { Body2Bold, Body3, H5Bold, H6 } from '../../../theme/fonts';
import MainHeader from '../../../components/main/Header';
import PAppContainer from '../../../components/common/PAppContainer';
import PostItem from '../../../components/main/PostItem';
import FeaturedItem from '../../../components/main/settings/FeaturedItem';
import Funds from '../../../components/main/settings/Funds';
import Members from '../../../components/main/settings/Members';
import PGradientOutlineButton from '../../../components/common/PGradientOutlineButton';
import CompanyDetail from './CompanyDetail';
import { Post } from 'mobile/src/graphql/query/post/usePosts';

import { useAccount } from '../../../graphql/query/account';
import { usePosts } from '../../../graphql/query/post/usePosts';
import { useCompany } from '../../../graphql/query/company/useCompany';
import NoPostSvg from 'shared/assets/images/no-post.svg';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const CompanyProfile: FC<RouterProps> = ({ navigation, route }) => {
  const { data, refetch } = usePosts();
  const { data: accountData } = useAccount();
  const { data: companyData } = useCompany(route.params?.companyId);
  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);

  const postData = data?.posts ?? [];
  const company = companyData?.companyProfile;

  const isMyCompany = useMemo(() => {
    if (route.params?.companyId && accountData?.account.companies) {
      const index = accountData?.account.companies.findIndex(
        (v) => v._id === route.params?.companyId,
      );
      return index > -1 ? true : false;
    }
    return false;
  }, [accountData, route.params]);

  if (isFocused !== focusState) {
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity>
      <FeaturedItem post={item} />
    </TouchableOpacity>
  );

  if (!company || !accountData) {
    return <View style={pStyles.globalContainer} />;
  }

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
        <Funds accredited={accountData?.account.accreditation} />
        <View style={styles.posts}>
          <Members members={company.members || []} key={company._id} />
          {postData.length > 0 ? (
            <View>
              <Text style={styles.text}>Featured Posts</Text>
              <FlatList
                data={postData || []}
                renderItem={renderItem}
                keyExtractor={(item) => `${item._id}`}
                listKey="post"
                horizontal
              />
            </View>
          ) : (
            isMyCompany && (
              <View style={styles.noPostContainer}>
                <Text style={styles.val}>You don’t have any posts, yet.</Text>
              </View>
            )
          )}

          {postData.length > 0 ? (
            <FlatList
              data={postData || []}
              renderItem={({ item }) => (
                <PostItem post={item} userId={accountData.account._id} />
              )}
              keyExtractor={(item) => `${item._id}`}
              listKey="post"
              ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
            />
          ) : (
            isMyCompany && (
              <View style={styles.noPostContainer}>
                <View style={styles.noPostContainer}>
                  <NoPostSvg />
                </View>
                <Text style={styles.val}>You don’t have any posts, yet.</Text>
                <PGradientOutlineButton
                  label="Create a Post"
                  btnContainer={styles.createPostBtn}
                  onPress={() => navigation.navigate('CreatePost')}
                />
              </View>
            )
          )}
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
  },
  backgroundImg: {
    width: Dimensions.get('screen').width,
    height: 65,
  },
  logo: {
    width: 80,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    backgroundColor: BGHEADER,
    paddingBottom: 16,
  },
  companyDetail: {
    flexDirection: 'row',
    marginTop: -40,
    marginBottom: 16,
  },
  val: {
    color: WHITE,
    ...H6,
  },
  comment: {
    color: WHITE12,
    ...Body3,
  },
  decription: {
    marginVertical: 16,
    color: WHITE,
    ...Body3,
  },
  social: {
    paddingVertical: 8,
    borderTopColor: GRAY100,
    borderBottomColor: GRAY100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 24,
    backgroundColor: BGHEADER,
    alignItems: 'center',
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
  posts: {
    paddingHorizontal: 16,
  },
  noPostContainer: {
    alignSelf: 'center',
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
