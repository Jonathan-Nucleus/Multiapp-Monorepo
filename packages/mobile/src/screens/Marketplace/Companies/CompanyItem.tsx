import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { PRIMARY, WHITE, WHITE12, BLACK } from 'shared/src/colors';
import {
  Body1,
  Body1Bold,
  Body2,
  Body3,
  Body3Bold,
} from 'mobile/src/theme/fonts';
import { FundCompanyData } from 'mobile/src/graphql/query/marketplace';

import FundCompanyInfo from './FundCompanyInfo';
import RoundImageView from '../../../components/common/RoundImageView';
import PLabel from '../../../components/common/PLabel';
import { AVATAR_URL } from 'react-native-dotenv';

import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

export type Fund = Exclude<FundCompanyData['fundCompanies'], undefined>[number];
interface CompanyItemProps {
  company: Fund;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }) => {
  const { name, fundManagers } = company;
  return (
    <View style={styles.companyItem}>
      <FundCompanyInfo item={company} />
      <PLabel label={name} textStyle={styles.nameLabel} />
      <View style={styles.separator} />
      <View style={styles.userInfo}>
        <RoundImageView
          image={{ uri: `${AVATAR_URL}/${fundManagers[0].avatar}` }}
          size={24}
        />
        <View style={{ marginLeft: 8 }}>
          <View style={styles.nameWrapper}>
            <PLabel
              label={`${fundManagers[0].firstName} ${fundManagers[0].lastName}`}
              textStyle={Body1}
            />
            <View style={styles.proWrapper}>
              <ShieldCheckSvg />
              <PLabel label="PRO" textStyle={styles.proLabel} />
            </View>
          </View>
          <PLabel
            label={fundManagers[0].position}
            textStyle={styles.titleLabel}
          />
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
    paddingBottom: 16,
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
