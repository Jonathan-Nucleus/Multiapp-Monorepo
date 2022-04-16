import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageURISource,
  Dimensions,
} from 'react-native';

import PLabel from './PLabel';
import RoundImageView from './RoundImageView';
import { Body1Bold, Body3 } from '../../theme/fonts';
import { WHITE60, PRIMARY, GRAY100 } from 'shared/src/colors';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

interface UserInfoProps {
  avatar: ImageURISource;
  name: string;
  role: string;
  company: string;
  isPro?: boolean;
  viewStyle?: object;
  avatarStyle?: object;
  avatarSize?: number;
  auxInfo?: string;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const { avatar, name, role, company, isPro, viewStyle, avatarSize, auxInfo } =
    props;

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <RoundImageView image={avatar} size={avatarSize} />
      <View style={styles.userInfo}>
        <View style={styles.nameWrapper}>
          <PLabel label={name} textStyle={styles.nameLabel} />
          {isPro && (
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          )}
        </View>
        <PLabel label={`${role} @ ${company}`} textStyle={styles.smallLabel} />
        <View style={styles.auxInfo}>
          {auxInfo && (
            <>
              <PLabel label={auxInfo} textStyle={styles.smallLabel} />
              <View style={styles.separator} />
            </>
          )}
          <TouchableOpacity onPress={() => console.log('Follow toggle')}>
            <Text style={[styles.smallLabel, styles.follow]}>Follow</Text>
          </TouchableOpacity>
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
    marginLeft: 8,
    alignItems: 'center',
  },
  proLabel: {
    marginLeft: 8,
    ...Body3,
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
    fontWeight: '600',
  },
});
