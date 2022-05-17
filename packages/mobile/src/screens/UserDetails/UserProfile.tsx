import React, { useMemo, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CaretLeft, Pencil } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PLabel from 'mobile/src/components/common/PLabel';
import PostItem from 'mobile/src/components/main/PostItem';
import FeaturedItem from 'mobile/src/components/main/settings/FeaturedItem';
import FollowModal from 'mobile/src/components/main/FollowModal';
import Funds from 'mobile/src/components/main/Funds';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import ProfilePlaceholder from '../../components/placeholder/ProfilePlaceholder';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2, Body3, H6Bold, H5Bold } from 'mobile/src/theme/fonts';
import {
  WHITE,
  BLUE300,
  PRIMARY,
  PRIMARYSOLID,
  WHITE12,
} from 'shared/src/colors';

import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import NoPostSvg from 'shared/assets/images/no-post.svg';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import { useProfile } from 'shared/graphql/query/user/useProfile';
import { usePosts, Post } from 'shared/graphql/query/user/usePosts';
import { useManagedFunds } from 'shared/graphql/query/user/useManagedFunds';
import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useFeaturedPosts } from 'shared/graphql/query/user/useFeaturedPosts';

import { UserProfileScreen } from 'mobile/src/navigations/UserDetailsStack';
import { BACKGROUND_URL } from 'react-native-dotenv';
import Avatar from '../../components/common/Avatar';

const UserProfile: UserProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  const [visibleFollowerModal, setVisibleFollowerModal] = useState(false);
  const [visibleFollowingModal, setVisibleFollowingModal] = useState(false);

  const { data: accountData } = useAccount({ fetchPolicy: 'cache-only' });
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchAccount,
  } = useProfile(userId);
  const { data: fundsData } = useManagedFunds(userId);
  const { data, refetch } = usePosts(userId);
  const { data: featuredPostsData } = useFeaturedPosts(userId);
  const { isFollowing, toggleFollow } = useFollowUser(userId);

  const account = accountData?.account;
  const funds = fundsData?.userProfile?.managedFunds ?? [];
  const profile = profileData?.userProfile;
  const postData = data?.userProfile?.posts ?? [];
  const featuredPosts = featuredPostsData?.userProfile?.posts ?? [];

  const isMyAccount = useMemo(() => {
    return userId === account?._id ? true : false;
  }, [account]);

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity>
      <FeaturedItem post={item} />
    </TouchableOpacity>
  );

  if (!account || !profile) {
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
        {!profile && <ProfilePlaceholder variant="user" />}
      </View>
    );
  }

  const {
    avatar,
    background,
    firstName,
    lastName,
    role,
    position,
    website,
    linkedIn,
    twitter,
    followerIds,
    followers,
    followingIds,
    following,
    postIds,
  } = profile;

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
          {background?.url ? (
            <FastImage
              style={styles.backgroundImg}
              source={{
                uri: `${BACKGROUND_URL}/${background.url}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <PGradientButton
              btnContainer={styles.noBackground}
              gradientContainer={styles.gradientContainer}
            />
          )}
          {isMyAccount && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditUserPhoto', {
                  type: 'BACKGROUND',
                })
              }
              style={styles.pencil}>
              <Pencil color={WHITE} size={18} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.companyDetail}>
            <View style={styles.relative}>
              <Avatar user={profile} size={80} />
              {isMyAccount && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EditUserPhoto', {
                      type: 'AVATAR',
                    })
                  }
                  style={styles.pencil}>
                  <Pencil color={WHITE} size={18} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.val}>
              {firstName} {lastName}
            </Text>
            {role !== 'USER' ? (
              <View style={styles.proWrapper}>
                <ShieldCheckSvg />
                <PLabel label="PRO" textStyle={styles.proLabel} />
              </View>
            ) : null}
          </View>
          <Text style={styles.positionInfo}>
            {position ? `${position}` : ''}
          </Text>
          <View style={[styles.row, styles.justifyAround]}>
            <Pressable
              onPress={() => setVisibleFollowerModal(followers?.length > 0)}
              style={({ pressed }) => [
                styles.follow,
                pressed ? pStyles.pressedStyle : {},
              ]}>
              <Text style={styles.val}>{followerIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Followers</Text>
            </Pressable>
            <Pressable
              onPress={() => setVisibleFollowingModal(following?.length > 0)}
              style={({ pressed }) => [
                styles.follow,
                pressed ? pStyles.pressedStyle : {},
              ]}>
              <Text style={styles.val}>{followingIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Following</Text>
            </Pressable>
            <View style={styles.follow}>
              <Text style={styles.val}>{postIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Posts</Text>
            </View>
          </View>
          {profile.tagline ? (
            <Text style={styles.tagline}>{profile.tagline}</Text>
          ) : null}
          <Text style={styles.decription}>{profile.overview}</Text>
          {isMyAccount ? (
            <PGradientOutlineButton
              label="Edit Profile"
              onPress={() => navigation.navigate('EditUserProfile')}
              gradientContainer={styles.editButton}
            />
          ) : (
            <View style={[styles.row, styles.between]}>
              <PGradientOutlineButton
                label="Message"
                onPress={() => console.log(11)}
                gradientContainer={styles.button}
              />
              <PGradientButton
                label={isFollowing ? 'Unfollow' : 'Follow'}
                onPress={toggleFollow}
                gradientContainer={styles.button}
              />
            </View>
          )}
        </View>
        <View
          style={[
            styles.row,
            styles.social,
            !linkedIn && !twitter && !website && styles.hide,
          ]}>
          {linkedIn ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(linkedIn)}
              style={styles.socialIcon}>
              <LinkedinSvg />
            </TouchableOpacity>
          ) : null}
          {twitter ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(twitter)}
              style={styles.socialIcon}>
              <TwitterSvg />
            </TouchableOpacity>
          ) : null}

          {website ? (
            <TouchableOpacity
              style={linkedIn || twitter ? styles.websiteContainer : {}}
              onPress={() => website && Linking.openURL(website)}>
              <Text style={styles.website} numberOfLines={1}>
                {website}
              </Text>
            </TouchableOpacity>
          ) : null}
          {/* <TouchableOpacity>
            <DotsThreeVerticalSvg />
          </TouchableOpacity> */}
        </View>
        <Funds accredited={profile.accreditation} funds={funds} />
        <View>
          {featuredPosts && featuredPosts.length > 0 && (
            <View>
              <Text style={styles.text}>Featured Posts</Text>
              <FlatList
                data={featuredPosts || []}
                extraData={account}
                renderItem={renderItem}
                keyExtractor={(item) => `${item._id}`}
                listKey="post"
                horizontal
              />
            </View>
          )}

          {postData && postData.length > 0 ? (
            <FlatList
              data={postData || []}
              extraData={account}
              renderItem={({ item }) => <PostItem post={item} />}
              keyExtractor={(item) => `${item._id}`}
              listKey="post"
              ListHeaderComponent={<Text style={styles.text}>All Posts</Text>}
            />
          ) : (
            isMyAccount && (
              <View style={styles.noPostContainer}>
                <View style={styles.noPostContainer}>
                  <NoPostSvg />
                </View>
                <Text style={styles.comment}>
                  You don’t have any posts, yet.
                </Text>
                <PGradientButton
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
          <FollowModal
            onClose={() => {
              setVisibleFollowerModal(false);
              setVisibleFollowingModal(false);
            }}
            following={following ?? []}
            followers={followers ?? []}
            isVisible={visibleFollowerModal || visibleFollowingModal}
            tab={visibleFollowingModal ? 'following' : 'follower'}
          />
        </View>
      </PAppContainer>
    </View>
  );
};

export default UserProfile;

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
  positionInfo: {
    color: WHITE,
    ...Body3,
  },
  tagline: {
    marginVertical: 16,
    color: WHITE,
    ...Body3,
  },
  decription: {
    marginBottom: 16,
    color: WHITE,
    ...Body3,
  },
  social: {
    borderTopColor: WHITE12,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    height: 60,
  },
  hide: {
    height: 0,
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
  websiteContainer: {
    borderLeftWidth: 1,
    borderLeftColor: WHITE12,
    height: '100%',
    justifyContent: 'center',
  },
  website: {
    color: PRIMARY,
    ...Body3,
    marginLeft: 16,
  },
  text: {
    color: WHITE,
    ...Body2,
    marginTop: 2,
    marginBottom: 8,
    paddingLeft: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  socialIcon: {
    marginHorizontal: 16,
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
    width: Dimensions.get('screen').width / 2 - 24,
  },
  editButton: {
    width: Dimensions.get('screen').width - 36,
  },
  relative: {
    position: 'relative',
  },
  noBackground: {
    height: 65,
  },
  gradientContainer: {
    borderRadius: 0,
    height: 65,
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
    textTransform: 'uppercase',
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
  noPostContainer: {
    alignSelf: 'center',
    marginBottom: 36,
  },
  createPostBtn: {
    marginTop: 25,
  },
});
