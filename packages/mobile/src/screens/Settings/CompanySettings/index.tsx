import React, { FC, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useIsFocused, NavigationProp } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import {
  WHITE,
  WHITE12,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
} from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import { Body2, Body3, H6 } from '../../../theme/fonts';
import MainHeader from '../../../components/main/Header';
import PAppContainer from '../../../components/common/PAppContainer';
import PostItem, { PostItemProps } from '../../../components/main/PostItem';
import FeaturedItem from '../../../components/main/settings/FeaturedItem';
import Funds from '../../../components/main/settings/Funds';
import Members from '../../../components/main/settings/Members';
import { useAccount } from '../../../graphql/query/account';
import CompanyProfile from './CompanyProfile';
import type { Company } from 'backend/graphql/companies.graphql';
import type { User } from 'backend/graphql/users.graphql';
import { useFetchPosts } from '../../../hooks/queries';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CompanySettings: FC<RouterProps> = ({ navigation }) => {
  const { data, error, loading, refetch } = useFetchPosts();
  const { data: accountData } = useAccount();
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

  const companyLists: Company[] = accountData?.account.companies ?? [];

  const renderItem = ({ item }: { item: PostItemProps }) => (
    <TouchableOpacity>
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
        {companyLists.map((company) => (
          <CompanyProfile company={company} key={company._id} />
        ))}
        <Funds />
        <View style={styles.posts}>
          {companyLists.map((company) => (
            <Members members={company.members || []} key={company._id} />
          ))}
          {postData.length > 0 && (
            <View>
              <Text style={styles.text}>Featured Posts</Text>
              <FlatList
                data={postData || []}
                renderItem={renderItem}
                keyExtractor={(item: PostItemProps) => `${item._id}`}
                listKey="post"
                horizontal
              />
            </View>
          )}

          {postData.length > 0 && (
            <FlatList
              data={postData || []}
              renderItem={({ item }) => (
                <PostItem post={item} userId={accountData?.account._id} />
              )}
              keyExtractor={(item: PostItemProps) => `${item._id}`}
              listKey="post"
              ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
            />
          )}
        </View>
      </PAppContainer>
    </View>
  );
};

export default CompanySettings;

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: BLUE300,
    width: 32,
    height: 32,
    borderRadius: 16,
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
    ...Body2,
    marginTop: 2,
    marginBottom: 8,
  },
  posts: {
    paddingHorizontal: 16,
  },
});
