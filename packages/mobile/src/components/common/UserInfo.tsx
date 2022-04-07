import React from 'react';
import { StyleSheet, View } from 'react-native';

import PLabel from './PLabel';
import RoundImageView from './RoundImageView';
import { Body1, Body3 } from '../../theme/fonts';
import { WHITE60 } from 'shared/src/colors';

interface UserInfoProps {
  avatar: number;
  name: string;
  role: string;
  company: string;
  isPro?: boolean;
  viewStyle?: object;
  avatarStyle?: object;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const { avatar, name, role, company, isPro, viewStyle } = props;

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <RoundImageView image={avatar} />
      <View style={styles.userInfo}>
        <View style={styles.nameWrapper}>
          <PLabel label={name} textStyle={styles.nameLabel} />
          {isPro && <PLabel label="PRO" textStyle={styles.proLabel} />}
        </View>
        <View>
          <PLabel
            label={`${role} @ ${company}`}
            textStyle={styles.smallLabel}
          />
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
    ...Body1,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  proLabel: {
    marginLeft: 8,
    ...Body3,
  },
  smallLabel: {
    ...Body3,
    color: WHITE60,
  },
});
