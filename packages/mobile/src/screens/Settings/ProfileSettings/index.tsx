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
import { CaretLeft } from 'phosphor-react-native';
import {
  WHITE,
  WHITE60,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
} from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import { Body2, Body3, H6 } from '../../../theme/fonts';
import MainHeader from '../../../components/main/Header';
import PAppContainer from '../../../components/common/PAppContainer';
import PGradientButton from '../../../components/common/PGradientButton';
import PLabel from '../../../components/common/PLabel';
import PostItem, { PostItemProps } from '../../../components/main/PostItem';
import FeaturedItem from '../../../components/main/settings/FeaturedItem';
import Funds from '../../../components/main/settings/Funds';
import usePost from '../../../hooks/usePost';
import BackgroundImg from 'shared/assets/images/bg-cover.png';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import AvatarImg from '../../../assets/avatar.png';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileSettings: FC<RouterProps> = ({ navigation }) => {
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
        <Image
          source={BackgroundImg}
          resizeMode="cover"
          style={styles.backgroundImg}
        />
        <View style={styles.content}>
          <View style={styles.companyDetail}>
            <Image
              source={AvatarImg}
              resizeMode="contain"
              style={styles.avatar}
            />
            <View style={[styles.row, styles.justifyAround]}>
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
          <View style={styles.row}>
            <Text style={styles.val}>Good Soil Invesments</Text>
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          </View>
          <Text style={styles.decription}>
            Virgin is a leading international investment group and one of the
            world's most recognised and respected brands. Read More...
          </Text>
          <PGradientButton label="follow" onPress={() => console.log(11)} />
        </View>
        <View style={styles.social}>
          <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('www.twitter.com')}
            style={styles.icon}>
            <TwitterSvg />
          </TouchableOpacity>
        </View>
        <Funds />
        <View style={styles.posts}>
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
              renderItem={({ item }) => <PostItem post={item} from="company" />}
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

export default ProfileSettings;

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
  },
  justifyAround: {
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
    color: WHITE60,
    ...Body3,
  },
  decription: {
    marginVertical: 16,
    color: WHITE,
    ...Body3,
  },
  social: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 24,
    backgroundColor: BGHEADER,
    alignItems: 'center',
    paddingHorizontal: 16,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  icon: {
    marginLeft: 32,
  },
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  proLabel: {
    marginLeft: 8,
    ...Body3,
  },
});
