import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Star } from 'phosphor-react-native';

import Avatar from './Avatar';
import PLabel from './PLabel';
import { Body1Bold, Body3, Body4Bold } from '../../theme/fonts';
import {
  WHITE60,
  PRIMARY,
  GRAY100,
  GRAY200,
  PRIMARYSOLID,
} from 'shared/src/colors';

import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';
import AISvg from 'shared/assets/images/AI.svg';
import GlobalSvg from 'shared/assets/images/global.svg';

import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useFollowCompany } from 'shared/graphql/mutation/account/useFollowCompany';
import { useAccountContext } from 'shared/context/Account';
import { Audience } from 'backend/graphql/posts.graphql';
import { UserProfile } from 'backend/graphql/users.graphql';
import { Company as CompanyProfile } from 'backend/graphql/companies.graphql';
import ProfileBadge from '../../screens/UserDetails/ProfileBadge';

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
  highlighted?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const {
    user,
    viewStyle,
    avatarSize,
    auxInfo,
    audienceInfo,
    showFollow = true,
    highlighted = false,
  } = props;
  let userData: User | undefined;
  let companyData: Company | undefined;
  if (user && 'firstName' in user) {
    userData = user;
  } else if (user) {
    companyData = user as Company;
  }

  const account = useAccountContext();
  const { isFollowing: isFollowingUser, toggleFollow: toggleFollowUser } =
    useFollowUser(user?._id);
  const { isFollowing: isFollowingCompany, toggleFollow: toggleFollowCompany } =
    useFollowCompany(user?._id);

  const { role, company } = userData ?? {};
  const isSelf = user?._id === account?._id;
  const isFollowing = isFollowingUser || isFollowingCompany;

  if (!user) {
    return null;
  }

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

  const toggleFollow = (): void => {
    companyData ? toggleFollowCompany() : toggleFollowUser();
  };

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
          {role && <ProfileBadge role={role} />}
        </View>
        {company ? (
          <PLabel label={company.name} textStyle={styles.smallLabel} />
        ) : null}
        <View style={styles.auxInfo}>
          {highlighted ? (
            <>
              <Star size={12} color={PRIMARYSOLID} weight="fill" />
              <PLabel
                label="Featured Post"
                textStyle={[styles.smallLabel, styles.highlighted]}
              />
              <View style={styles.separator} />
            </>
          ) : undefined}
          {auxInfo ? (
            <PLabel label={auxInfo} textStyle={styles.smallLabel} />
          ) : null}
          {/*audienceInfo ? (
            <View style={styles.audienceInfo}>{audienceIcon}</View>
          ) : null*/}
          {!isSelf && showFollow && (
            <>
              {!isFollowing ? <View style={styles.separator} /> : null}
              <TouchableOpacity onPress={toggleFollow}>
                <Text style={[styles.smallLabel, styles.follow]}>
                  {!isFollowing ? 'Follow' : null}
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
  smallLabel: {
    ...Body3,
    color: WHITE60,
  },
  auxInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  highlighted: {
    marginLeft: 4,
    color: GRAY200,
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
  },
  follow: {
    textTransform: 'uppercase',
    color: PRIMARY,
    ...Body4Bold,
    letterSpacing: 1.25,
  },
});
