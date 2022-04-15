import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { PRIMARY, WHITE, WHITE12, BLACK } from 'shared/src/colors';
import { Body1Bold, Body2, Body3, Body3Bold } from 'mobile/src/theme/fonts';
import { FetchFundsData } from 'mobile/src/graphql/query/marketplace';

import FundUserInfo from './FundUserInfo';
import RoundImageView from '../common/RoundImageView';
import PLabel from '../common/PLabel';
import { AVATAR_URL } from 'react-native-dotenv';

import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

export type Fund = Exclude<FetchFundsData['funds'], undefined>[number];
interface CompanyItemProps {
  fund: Fund;
}

const CompanyItem: FC<CompanyItemProps> = ({ fund }) => {
  return (
    <View style={styles.companyItem}>
      <FundUserInfo item={fund.manager} />
      <PLabel label="Good Soil Initiatives" textStyle={styles.nameLabel} />
      <View style={styles.separator} />
      <PLabel label="FUNDS MANAGED" textStyle={styles.titleLabel} />
      <PLabel
        label="Accelerated Opportunities LP Concentrated Growth Fund"
        textStyle={styles.desLabel}
      />
      <View style={styles.userInfo}>
        <RoundImageView
          image={{ uri: `${AVATAR_URL}/${fund.manager.avatar}` }}
          size={24}
        />
        <View style={{ marginLeft: 8 }}>
          <View style={styles.nameWrapper}>
            <PLabel
              label={`${fund.manager.firstName} ${fund.manager.lastName}`}
              textStyle={styles.nameLabel}
            />
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          </View>
          <PLabel label="CEO" textStyle={styles.titleLabel} />
        </View>
      </View>
    </View>
  );
};

export default CompanyItem;

const styles = StyleSheet.create({
  companyItem: {
    marginBottom: 16,
    paddingHorizontal: 23,
    paddingVertical: 16,
    backgroundColor: BLACK,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  nameLabel: {
    ...Body1Bold,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
