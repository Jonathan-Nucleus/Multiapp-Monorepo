import React from 'react';
import { StyleSheet, Text, View, StyleProp } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { GRAY200, PRIMARYSOLID } from 'shared/src/colors';

import type { UserProfile } from 'backend/graphql/users.graphql';
import type { Company as CompanyProfile } from 'backend/graphql/companies.graphql';
import { S3_BUCKET_DEV, S3_BUCKET_STAGING } from 'react-native-dotenv';
import { Body2Bold } from '../../theme/fonts';

import { avatarUrl } from 'mobile/src/utils/env';

type User = Partial<
  Pick<UserProfile, '_id' | 'firstName' | 'lastName' | 'avatar'>
>;
type Company = Pick<CompanyProfile, '_id' | 'name' | 'avatar'>;
interface AvatarProps {
  user?: User | Company;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 64, style }) => {
  if (!user) {
    return null;
  }

  const sizeStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  let userData: User | null = null;
  let companyData: Company | null = null;
  if ('firstName' in user) {
    userData = user;
  } else {
    companyData = user as Company;
  }

  return user?.avatar ? (
    <FastImage
      style={[sizeStyles, style]}
      source={{
        uri: `${avatarUrl()}/${userData?._id || companyData?._id}/${
          user.avatar
        }`,
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  ) : (
    <View style={[styles.defaultAvatar, sizeStyles, style]}>
      {userData ? (
        <Text style={styles.initials} adjustsFontSizeToFit numberOfLines={1}>
          {userData.firstName?.charAt(0)}
          {userData.lastName?.charAt(0)}
        </Text>
      ) : null}
      {companyData ? (
        <Text style={styles.initials} adjustsFontSizeToFit numberOfLines={1}>
          {companyData.name?.charAt(0)}
        </Text>
      ) : null}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  defaultAvatar: {
    backgroundColor: GRAY200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: PRIMARYSOLID,
    textAlign: 'center',
    ...Body2Bold,
    textTransform: 'capitalize',
  },
});
