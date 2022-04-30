import React, { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { PRIMARY, WHITE, WHITE12, BLACK } from 'shared/src/colors';
import {
  Body1,
  Body1Bold,
  Body2,
  Body3,
  Body3Bold,
} from 'mobile/src/theme/fonts';

import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';
import FundCompanyInfo from './FundCompanyInfo';

import { Company } from 'mobile/src/graphql/query/marketplace';
import { AVATAR_URL } from 'react-native-dotenv';

interface CompanyItemProps {
  company: Company;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }) => {
  const { name, fundManagers } = company;

  // Only show data for first fund manager
  const manager = fundManagers[0];
  const { _id, firstName, lastName, avatar, position } = manager;

  const goToManager = () =>
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: manager._id,
      },
    });

  return (
    <View style={styles.companyItem}>
      <FundCompanyInfo company={company} />
      <PLabel label={name} textStyle={styles.nameLabel} />
      <View style={styles.separator} />
      <Pressable onPress={goToManager}>
        <View style={styles.userInfo}>
          <Avatar user={manager} size={24} />
          <View style={{ marginLeft: 8 }}>
            <View style={styles.nameWrapper}>
              <PLabel label={`${firstName} ${lastName}`} textStyle={Body1} />
              {manager.role === 'PROFESSIONAL' && (
                <View style={styles.proWrapper}>
                  <ShieldCheckSvg />
                  <PLabel label="PRO" textStyle={styles.proLabel} />
                </View>
              )}
            </View>
            {position ? (
              <PLabel label={position} textStyle={styles.titleLabel} />
            ) : null}
          </View>
        </View>
      </Pressable>
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
