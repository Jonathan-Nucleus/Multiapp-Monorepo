import React from 'react';
import { StyleSheet, Text, View, StyleProp } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { GRAY200, PRIMARYSOLID } from 'shared/src/colors';

import type { UserProfile } from 'backend/graphql/users.graphql';
import { AVATAR_URL } from 'react-native-dotenv';
import { Body2Bold } from '../../theme/fonts';

type User = Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'avatar'>>;
interface AvatarProps {
  user?: User;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 64, style }) => {
  const sizeStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return user?.avatar ? (
    <FastImage
      style={[sizeStyles, style]}
      source={{
        uri: `${AVATAR_URL}/${user.avatar}`,
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  ) : (
    <View style={[styles.defaultAvatar, sizeStyles, style]}>
      <Text style={styles.initials} adjustsFontSizeToFit numberOfLines={1}>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </Text>
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
  },
});
