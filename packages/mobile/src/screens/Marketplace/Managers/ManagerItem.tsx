import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { PRIMARY, WHITE, WHITE12, BLACK } from 'shared/src/colors';
import { Body1Bold, Body2, Body3, Body3Bold } from 'mobile/src/theme/fonts';

import FundUserInfo from './FundUserInfo';
import PLabel from '../../../components/common/PLabel';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

import { FundManager } from 'mobile/src/graphql/query/marketplace/useFundManagers';

interface ManagerItemProps {
  manager: FundManager;
}

const ManagerItem: FC<ManagerItemProps> = ({ manager }) => {
  return (
    <View style={styles.managerItem}>
      <FundUserInfo item={manager} />
      <View style={styles.nameWrapper}>
        <PLabel
          label={`${manager.firstName} ${manager.lastName}`}
          textStyle={styles.nameLabel}
        />
        <View style={styles.proWrapper}>
          <ShieldCheckSvg />
          <PLabel label="PRO" textStyle={styles.proLabel} />
        </View>
      </View>
      <PLabel label="Founder" textStyle={styles.titleLabel} />
      <PLabel label="Good Soil" textStyle={styles.desLabel} />
      <View style={styles.separator} />
      <PLabel label="FUNDS MANAGED" textStyle={styles.titleLabel} />
      <PLabel
        label="Accelerated Opportunities LP Concentrated Growth Fund"
        textStyle={styles.desLabel}
      />
    </View>
  );
};

export default ManagerItem;

const styles = StyleSheet.create({
  managerItem: {
    marginBottom: 16,
    paddingHorizontal: 23,
    paddingVertical: 16,
    backgroundColor: BLACK,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  nameLabel: {
    ...Body1Bold,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  proLabel: {
    marginLeft: 8,
    ...Body3Bold,
  },
  whiteText: {
    color: WHITE,
  },
  desLabel: {
    color: PRIMARY,
    lineHeight: 20,
    ...Body2,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: WHITE12,
    marginVertical: 16,
  },
  titleLabel: {
    ...Body3,
    marginBottom: 4,
  },
});
