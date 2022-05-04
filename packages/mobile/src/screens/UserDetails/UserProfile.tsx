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
import FastImage from 'react-native-fast-image';
import {
  useIsFocused,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { CaretLeft, Pencil } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PLabel from 'mobile/src/components/common/PLabel';
import PostItem from 'mobile/src/components/main/PostItem';
import FeaturedItem from 'mobile/src/components/main/settings/FeaturedItem';
import Funds from 'mobile/src/components/main/Funds';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import ProfilePlaceholder from '../../components/placeholder/ProfilePlaceholder';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2, Body3, H6Bold, H5Bold } from 'mobile/src/theme/fonts';
import {
  WHITE,
  BLUE300,
  GRAY100,
  PRIMARY,
  PRIMARYSOLID,
} from 'shared/src/colors';

import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import NoPostSvg from 'shared/assets/images/no-post.svg';

import { useAccount } from 'mobile/src/graphql/query/account';
import { useProfile } from 'mobile/src/graphql/query/user/useProfile';
import { usePosts, Post } from 'mobile/src/graphql/query/user/usePosts';
import { useManagedFunds } from 'mobile/src/graphql/query/user/useManagedFunds';
import { useFollowUser } from 'mobile/src/graphql/mutation/account';

import { UserProfileScreen } from 'mobile/src/navigations/UserDetailsStack';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

const UserProfile: UserProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  const { data: accountData } = useAccount({ fetchPolicy: 'cache-only' });
  const { data: profileData, loading: profileLoading } = useProfile(userId);
  const { data: fundsData } = useManagedFunds(userId);
  const { data, refetch } = usePosts(userId);
  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  const [followUser] = useFollowUser();

  const account = accountData?.account;
  const following = account?.followingIds?.includes(userId ?? '');
  const funds = fundsData?.userProfile?.managedFunds ?? [];
  const profile = profileData?.userProfile;
  const postData = data?.userProfile?.posts ?? [];
  const [isFollowing, setIsFollowing] = useState(following);

  // Refetch whenever the focus state changes to avoid refetching during
  // rerender cycles
  if (isFocused !== focusState) {
    refetch();
    setFocusState(isFocused);
  }

  const isMyAccount = useMemo(() => {
    return userId === account?._id ? true : false;
  }, [account]);

  const toggleFollow = async () => {
    try {
      const result = await followUser({
        variables: { follow: !isFollowing, userId: userId },
      });

      if (result.data?.followUser) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity>
      <FeaturedItem post={item} />
    </TouchableOpacity>
  );

  if (!account || profileLoading) {
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
        <ProfilePlaceholder variant="user" />
      </View>
    );
  }

  if (!profile) {
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
    followingIds,
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
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          </View>
          <Text style={styles.comment}>
            {role}
            {position ? ` - ${position}` : ''}
          </Text>
          <View style={[styles.row, styles.justifyAround]}>
            <View style={styles.follow}>
              <Text style={styles.val}>{followerIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Followers</Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>{followingIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Following</Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>{postIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Posts</Text>
            </View>
          </View>
          <Text style={styles.decription}>{account.overview}</Text>
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
        <View style={[styles.row, styles.social]}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => Linking.openURL(linkedIn ?? 'www.linkedin.com')}>
              <LinkedinSvg />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL(twitter ?? 'www.twitter.com')}
              style={styles.icon}>
              <TwitterSvg />
            </TouchableOpacity>
          </View>
          {website ? (
            <>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                onPress={() => website && Linking.openURL(website)}>
                <Text style={styles.website} numberOfLines={1}>
                  {website}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          <TouchableOpacity>
            <DotsThreeVerticalSvg />
          </TouchableOpacity>
        </View>
        <Funds accredited={accountData?.account.accreditation} funds={funds} />
        <View style={styles.posts}>
          {postData && postData.length > 0 ? (
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
            isMyAccount &&
            postData.length > 0 && (
              <View style={styles.noPostContainer}>
                <Text style={styles.val}>You don’t have any posts, yet.</Text>
              </View>
            )
          )}

          {postData && postData.length > 0 ? (
            <FlatList
              data={postData || []}
              renderItem={({ item }) => (
                <PostItem post={item} userId={account._id} />
              )}
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
                <Text style={styles.val}>You don’t have any posts, yet.</Text>
                <PGradientButton
                  label="Create a Post"
                  btnContainer={styles.createPostBtn}
                  onPress={() =>
                    navigation.navigate('PostDetails', { screen: 'CreatePost' })
                  }
                />
              </View>
            )
          )}
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
