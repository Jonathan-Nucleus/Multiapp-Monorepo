import React, { FC, useEffect, useState } from 'react';
import {
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
import PostItem from '../../../../components/main/PostItem';
import FeaturedItem from '../../../../components/main/settings/FeaturedItem';
import Funds from '../../../../components/main/settings/Funds';
import { useAccount } from '../../../../graphql/query/account';
import { usePosts, Post } from 'mobile/src/graphql/query/post/usePosts';
import PGradientOutlineButton from '../../../../components/common/PGradientOutlineButton';
import { UserProfile as UserProfileProps } from 'mobile/src/graphql/query/user/useProfile';

import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import NoPostSvg from 'shared/assets/images/no-post.svg';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const UserProfile: FC<RouterProps> = ({ navigation }) => {
  const { data, refetch } = usePosts();
  const { data: accountData } = useAccount();
  const postData = data?.posts ?? [];
  const account = accountData?.account;
  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);

  if (isFocused !== focusState) {
    // Refetch whenever the focus state changes to avoid refetching during
    // rerender cycles
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity>
      <FeaturedItem post={item} />
    </TouchableOpacity>
  );

  if (!account) {
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
          {account.background?.url ? (
            <FastImage
              style={styles.backgroundImg}
              source={{
                uri: `${BACKGROUND_URL}/${account.background.url}`,
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
            onPress={() =>
              navigation.navigate('EditPhoto', {
                user: account,
                type: 'BACKGROUND',
              })
            }
            style={styles.pencil}>
            <Pencil color={WHITE} size={18} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.companyDetail}>
            <View style={styles.relative}>
              {account?.avatar ? (
                <FastImage
                  style={styles.avatar}
                  source={{
                    uri: `${AVATAR_URL}/${account?.avatar}`,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={styles.noAvatarContainer}>
                  <Text style={styles.noAvatar}>
                    {account.firstName.charAt(0)}
                    {account.lastName.charAt(0)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditPhoto', {
                    user: account,
                    type: 'AVATAR',
                  })
                }
                style={styles.pencil}>
                <Pencil color={WHITE} size={18} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.val}>
              {account.firstName} {account?.lastName}
            </Text>
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          </View>
          <Text style={styles.comment}>
            {account.role} - {account?.position}
          </Text>
          <View style={[styles.row, styles.justifyAround]}>
            <View style={styles.follow}>
              <Text style={styles.val}>{account.followerIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Followers</Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>
                {account.followingIds?.length ?? 0}
              </Text>
              <Text style={styles.comment}>Following</Text>
            </View>
            <View style={styles.follow}>
              <Text style={styles.val}>{account.postIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Posts</Text>
            </View>
          </View>
          <Text style={styles.decription}>{account.overview}</Text>
          <PGradientOutlineButton
            label="Edit Profile"
            onPress={() =>
              navigation.navigate('EditProfile', { user: account })
            }
            gradientContainer={styles.button}
          />
        </View>
        <View style={[styles.row, styles.social]}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(account.linkedIn ?? 'www.linkedin.com')
              }>
              <LinkedinSvg />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(account.twitter ?? 'www.twitter.com')
              }
              style={styles.icon}>
              <TwitterSvg />
            </TouchableOpacity>
          </View>
          {account.website && (
            <>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                onPress={() => Linking.openURL(account.website ?? '')}>
                <Text style={styles.website} numberOfLines={1}>
                  {account.website}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity>
            <DotsThreeVerticalSvg />
          </TouchableOpacity>
        </View>
        <Funds accredited={accountData?.account.accreditation} />
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
                <PostItem post={item} userId={account._id} />
              )}
              keyExtractor={(item: Post) => `${item._id}`}
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
