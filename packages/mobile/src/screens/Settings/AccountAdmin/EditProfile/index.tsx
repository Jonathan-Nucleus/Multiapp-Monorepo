import React, { FC, useEffect, useState } from 'react';
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
import FastImage from 'react-native-fast-image';
import { useIsFocused, NavigationProp } from '@react-navigation/native';
import { CaretLeft, Pencil } from 'phosphor-react-native';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

import {
  WHITE,
  WHITE60,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
  PRIMARYSOLID,
} from 'shared/src/colors';
import pStyles from '../../../../theme/pStyles';
import { Body2, Body3, H5Bold, H6Bold } from '../../../../theme/fonts';
import MainHeader from '../../../../components/main/Header';
import PAppContainer from '../../../../components/common/PAppContainer';
import PGradientButton from '../../../../components/common/PGradientButton';
import PLabel from '../../../../components/common/PLabel';
import PostItem, { Post } from '../../../../components/main/PostItem';
import FeaturedItem from '../../../../components/main/settings/FeaturedItem';
import Funds from '../../../../components/main/settings/Funds';
import PGradientOutlineButton from '../../../../components/common/PGradientOutlineButton';

import { useAccount } from '../../../../graphql/query/account';
import { usePosts } from '../../../../graphql/query/account/usePosts';
import type { User } from 'backend/graphql/users.graphql';

import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import NoPostSvg from 'shared/assets/images/no-post.svg';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const EditUserProfile: FC<RouterProps> = ({ navigation }) => {
  const { data, refetch } = usePosts();
  const { data: accountData } = useAccount();
  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);

  const postData = data?.account?.posts ?? [];
  const account = accountData?.account;

  if (isFocused !== focusState) {
    // Refetch whenever the focus state changes to avoid refetching during
    // rerender cycles
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  if (!account) return null;
  const {
    avatar,
    background,
    firstName,
    lastName,
    overview,
    accreditation,
    role,
    position,
    website,
    linkedIn,
    twitter,
    followerIds,
    followingIds,
    postIds,
  } = account;

  const renderItem: ListRenderItem<Post> = ({ item }) => (
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
        <View style={styles.relative}>
          {background ? (
            <FastImage
              style={styles.backgroundImg}
              source={{
                uri: `${BACKGROUND_URL}/${background}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <PGradientButton
              btnContainer={styles.noBackground}
              gradientContainer={styles.gradientContainer}
            />
          )}
          <TouchableOpacity
            onPress={() => console.log(111)}
            style={styles.pencil}>
            <Pencil color={WHITE} size={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.companyDetail}>
            <View style={styles.relative}>
              {avatar ? (
                <FastImage
                  style={styles.avatar}
                  source={{
                    uri: `${AVATAR_URL}/${avatar}`,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={styles.noAvatarContainer}>
                  <Text style={styles.noAvatar}>
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => console.log(111)}
                style={styles.pencil}>
                <Pencil color={WHITE} size={18} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.val}>
              {firstName} {lastName}
            </Text>
            {(role === 'VERIFIED' || role === 'PROFESSIONAL') && (
              <View style={styles.proWrapper}>
                <ShieldCheckSvg />
                <PLabel label="PRO" textStyle={styles.proLabel} />
              </View>
            )}
          </View>
          <Text style={styles.comment}>
            {role}
            {position && ` - ${position}`}
          </Text>
          <View style={[styles.row, styles.justifyAround]}>
            <View style={styles.follow}>
              <Text style={styles.val}>{followerIds?.length ?? 0}</Text>
              <Text style={styles.comment}>
                {followerIds?.length === 1 ? 'Follower' : 'Followers'}
              </Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>{followingIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Following</Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>{postIds?.length ?? 0}</Text>
              <Text style={styles.comment}>
                {postIds?.length === 1 ? 'Post' : 'Posts'}
              </Text>
            </View>
          </View>
          <Text style={styles.decription}>{overview}</Text>
          <PGradientOutlineButton
            label="Edit Profile"
            onPress={() => console.log(11)}
            gradientContainer={styles.button}
          />
        </View>
        <View style={[styles.row, styles.social]}>
          <View style={styles.row}>
            {linkedIn && (
              <TouchableOpacity onPress={() => Linking.openURL(linkedIn)}>
                <LinkedinSvg />
              </TouchableOpacity>
            )}
            {twitter && (
              <TouchableOpacity
                onPress={() => Linking.openURL(twitter)}
                style={styles.icon}>
                <TwitterSvg />
              </TouchableOpacity>
            )}
          </View>
          {website && (
            <>
              <View style={styles.verticalLine} />
              <TouchableOpacity onPress={() => Linking.openURL(website)}>
                <Text style={styles.website} numberOfLines={1}>
                  {website}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity>
            <DotsThreeVerticalSvg />
          </TouchableOpacity>
        </View>
        <Funds accredited={accreditation} />
        <View style={styles.posts}>
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
            <View style={styles.noPostContainer}>
              <Text style={styles.val}>You don’t have any posts, yet.</Text>
            </View>
          )}
          {postData.length > 0 ? (
            <FlatList
              data={postData || []}
              renderItem={({ item }) => (
                <PostItem post={item} userId={account?._id} />
              )}
              keyExtractor={(item) => `${item._id}`}
              listKey="post"
              ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
            />
          ) : (
            <View style={styles.noPostContainer}>
              <View style={styles.noPostContainer}>
                <NoPostSvg />
              </View>
              <Text style={styles.val}>You don’t have any posts, yet.</Text>
              <PGradientButton
                label="Create a Post"
                btnContainer={styles.createPostBtn}
                onPress={() => navigation.navigate('CreatePost')}
              />
            </View>
          )}
        </View>
      </PAppContainer>
    </View>
  );
};

export default EditUserProfile;

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
    marginVertical: 10,
  },
  between: {
    justifyContent: 'space-between',
  },
  justifyAround: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyDetail: {
    flexDirection: 'row',
    marginTop: -40,
    marginBottom: 16,
  },
  val: {
    color: WHITE,
    ...H6Bold,
  },
  comment: {
    color: WHITE,
    ...Body3,
    marginLeft: 8,
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
    alignItems: 'center',
    paddingLeft: 16,
    justifyContent: 'space-between',
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
  button: {
    width: Dimensions.get('screen').width - 32,
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
  relative: {
    position: 'relative',
  },
  pencil: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARYSOLID,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBackground: {
    height: 65,
  },
  gradientContainer: {
    borderRadius: 0,
    height: 65,
  },
});
