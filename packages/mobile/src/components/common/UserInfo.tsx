import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import Avatar from './Avatar';
import PLabel from './PLabel';
import { Body1Bold, Body3, Body3Bold, Body4Bold } from '../../theme/fonts';
import { WHITE60, PRIMARY, GRAY100 } from 'shared/src/colors';

import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';
import AISvg from 'shared/assets/images/AI.svg';
import GlobalSvg from 'shared/assets/images/global.svg';

import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import { Audience } from 'backend/graphql/posts.graphql';
import { UserProfile } from 'backend/graphql/users.graphql';
import { Company as CompanyProfile } from 'backend/graphql/companies.graphql';

type User = Partial<
  Pick<UserProfile, '_id' | 'firstName' | 'lastName' | 'avatar' | 'role'>
> & {
  company?: { name: string };
};

type Company = Pick<CompanyProfile, '_id' | 'name' | 'avatar'>;

interface UserInfoProps {
  user?: User | Company;
  viewStyle?: object;
  avatarStyle?: object;
  avatarSize?: number;
  auxInfo?: string;
  audienceInfo?: Audience;
  showFollow?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {
    user,
    viewStyle,
    avatarSize,
    auxInfo,
    audienceInfo,
    showFollow = true,
  } = props;
  if (!user) return null;

  let userData: User | undefined;
  let companyData: Company | undefined;
  if ('firstName' in user) {
    userData = user;
  } else {
    companyData = user as Company;
  }

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  const { role, company } = userData ?? {};
  const isPro = role === 'PROFESSIONAL' || role === 'VERIFIED';
  const isSelf = user?._id === account?._id;

  let audienceIcon;
  switch (audienceInfo) {
    case 'ACCREDITED':
      audienceIcon = <AISvg width={12} height={12} />;
      break;

    case 'QUALIFIED_CLIENT':
      audienceIcon = <QCSvg width={12} height={12} />;
      break;

    case 'QUALIFIED_PURCHASER':
      audienceIcon = <QPSvg width={12} height={12} />;
      break;

    case 'EVERYONE':
      audienceIcon = <GlobalSvg width={12} height={12} />;
      break;

    default:
      audienceIcon = <GlobalSvg width={12} height={12} />;
      break;
  }

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <Avatar user={user} size={avatarSize} />
      <View style={styles.userInfo}>
        <View style={styles.nameWrapper}>
          {userData ? (
            <PLabel
              label={`${userData.firstName} ${userData.lastName}`}
              textStyle={styles.nameLabel}
            />
          ) : null}
          {companyData ? (
            <PLabel
              label={`${companyData.name}`}
              textStyle={styles.nameLabel}
            />
          ) : null}
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
          {audienceInfo ? (
            <View style={styles.audienceInfo}>{audienceIcon}</View>
          ) : null}
          {!isSelf && showFollow && (
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
    textTransform: 'capitalize',
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
  audienceInfo: {
    marginLeft: 4,
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
