import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import Avatar from './Avatar';
import PLabel from './PLabel';
import { Body1Bold, Body3, Body3Bold, Body4Bold } from '../../theme/fonts';
import { WHITE60, PRIMARY, GRAY100 } from 'shared/src/colors';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

import { useFollowUser } from 'mobile/src/graphql/mutation/account';
import { useAccount } from 'mobile/src/graphql/query/account';
import { UserProfile } from 'backend/graphql/users.graphql';

type User = Partial<
  Pick<UserProfile, '_id' | 'firstName' | 'lastName' | 'avatar' | 'role'>
> & {
  company?: { name: string };
};

interface UserInfoProps {
  user: User;
  viewStyle?: object;
  avatarStyle?: object;
  avatarSize?: number;
  auxInfo?: string;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const { user, viewStyle, avatarSize, auxInfo } = props;

  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();

  const account = accountData?.account;
  const { role, company } = user;
  const isPro = user?.role === 'PROFESSIONAL';
  const isSelf = user?._id === account?._id;
  const following = account?.followingIds?.includes(user?._id ?? '');

  const [isFollowing, setIsFollowing] = useState(following);
  const toggleFollow = async () => {
    if (!user || !user._id) return;

    setIsFollowing(!isFollowing);

    const result = await followUser({
      variables: { follow: !following, userId: user._id },
    });

    if (!result.data?.followUser) {
      setIsFollowing(following);
    }
  };

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <Avatar user={user} size={avatarSize} />
      <View style={styles.userInfo}>
        <View style={styles.nameWrapper}>
          <PLabel
            label={`${user.firstName} ${user.lastName}`}
            textStyle={styles.nameLabel}
          />
          {isPro && (
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          )}
        </View>
        {company ? (
          <PLabel label={company.name} textStyle={styles.smallLabel} />
        ) : null}
        <View style={styles.auxInfo}>
          {auxInfo ? (
            <PLabel label={auxInfo} textStyle={styles.smallLabel} />
          ) : null}
          {!isSelf && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity onPress={toggleFollow}>
                <Text style={[styles.smallLabel, styles.follow]}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  nameLabel: {
    ...Body1Bold,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
    alignItems: 'center',
  },
  proLabel: {
    marginLeft: 4,
    ...Body3Bold,
  },
  smallLabel: {
    ...Body3,
    color: WHITE60,
    marginBottom: 4,
  },
  auxInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY100,
    marginHorizontal: 8,
    marginTop: -2,
  },
  follow: {
    textTransform: 'uppercase',
    color: PRIMARY,
    ...Body4Bold,
    letterSpacing: 1.25,
  },
});
