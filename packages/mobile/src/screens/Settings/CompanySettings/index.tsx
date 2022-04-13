import React, { FC, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Switch,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useIsFocused, NavigationProp } from '@react-navigation/native';
import {
  CaretLeft,
  MagnifyingGlass,
  Gear,
  DotsThreeVertical,
  UserCirclePlus,
} from 'phosphor-react-native';
import {
  WHITE,
  WHITE12,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
} from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3, H6 } from '../../../theme/fonts';
import MainHeader from '../../../components/main/Header';
import PAppContainer from '../../../components/common/PAppContainer';
import PGradientButton from '../../../components/common/PGradientButton';
import PostItem, { PostItemProps } from '../../../components/main/PostItem';
import Funds from './Funds';
import usePost from '../../../hooks/usePost';
import BackgroundImg from 'shared/assets/images/bg-cover.png';
import CompanyLogo from 'shared/assets/images/company-logo.svg';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CompanySettings: FC<RouterProps> = ({ navigation }) => {
  const { data, error, loading, refetch } = usePost();
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

  const renderItem = ({ item }: { item: PostItemProps }) => (
    <PostItem post={item} />
  );

  console.log(12312, postData);

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
        <Image
          source={BackgroundImg}
          resizeMode="cover"
          style={styles.backgroundImg}
        />
        <View style={styles.content}>
          <View style={styles.companyDetail}>
            <CompanyLogo />
            <View style={styles.row}>
              <View>
                <Text style={styles.val}>64</Text>
                <Text style={styles.comment}>Followers</Text>
              </View>
              <View>
                <Text style={styles.val}>64</Text>
                <Text style={styles.comment}>Following</Text>
              </View>
              <View>
                <Text style={styles.val}>64</Text>
                <Text style={styles.comment}>Posts</Text>
              </View>
            </View>
          </View>
          <Text style={styles.val}>Good Soil Invesments</Text>
          <Text style={styles.decription}>
            Virgin is a leading international investment group and one of the
            world's most recognised and respected brands. Read More...
          </Text>
          <PGradientButton label="follow" onPress={() => console.log(11)} />
        </View>
        <View style={[styles.row, styles.social]}>
          <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
            <TwitterSvg />
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
            <Text style={styles.website}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <DotsThreeVerticalSvg />
          </TouchableOpacity>
        </View>
        {postData.length > 0 && (
          <FlatList
            data={postData || []}
            renderItem={renderItem}
            keyExtractor={(item: PostItemProps) => `${item._id}`}
            listKey="post"
            ListHeaderComponent={
              <Text style={styles.text}>Featured Posts</Text>
            }
          />
        )}
        {postData.length > 0 && (
          <FlatList
            data={postData || []}
            renderItem={renderItem}
            keyExtractor={(item: PostItemProps) => `${item._id}`}
            listKey="post"
            ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
          />
        )}
        <Funds />
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
    ...Body1,
    paddingLeft: 16,
  },
});
