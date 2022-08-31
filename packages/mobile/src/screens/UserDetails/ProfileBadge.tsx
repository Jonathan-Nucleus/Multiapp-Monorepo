import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ShieldCheck } from 'phosphor-react-native';
import { PRIMARYSOLID, SUCCESS } from 'shared/src/colors';
import PLabel from '../../components/common/PLabel';
import { Body3 } from '../../theme/fonts';
import { UserSummary } from 'shared/graphql/fragments/user';

interface ProfileBadgeProps {
  role: UserSummary['role'];
}

const ProfileBadge: React.FC<ProfileBadgeProps> = (props) => {
  const { role } = props;

  if (role === 'PROFESSIONAL' || role === 'VERIFIED') {
    return (
      <View style={styles.proWrapper}>
        <ShieldCheck
          size={16}
          color={SUCCESS}
          weight="fill"
          style={styles.shield}
        />
        <PLabel label="PRO" textStyle={styles.proLabel} />
      </View>
    );
  } else if (
    role === 'FA' ||
    role === 'FO' ||
    role === 'IA' ||
    role === 'RIA'
  ) {
    return (
      <View style={styles.proWrapper}>
        <ShieldCheck
          size={16}
          color={PRIMARYSOLID}
          weight="fill"
          style={styles.shield}
        />
        <PLabel label={role} textStyle={styles.proLabel} />
      </View>
    );
  }

  return null;
};

export default ProfileBadge;

const styles = StyleSheet.create({
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  shield: {
    marginTop: -2,
  },
  proLabel: {
    marginLeft: 8,
    ...Body3,
  },
});
