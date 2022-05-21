import React, { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { PRIMARY, WHITE, WHITE12, BLACK } from 'shared/src/colors';
import { Body1Bold, Body2, Body3, Body3Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';

import FundUserInfo from './FundUserInfo';
import PLabel from 'mobile/src/components/common/PLabel';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

import {
  FundManager as FundManagerType,
  FundListItem,
} from 'shared/graphql/query/marketplace/useFundManagers';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

type FundManager = FundManagerType & {
  funds: FundListItem[];
};

interface ManagerItemProps {
  manager: FundManager;
}

const ManagerItem: FC<ManagerItemProps> = ({ manager }) => {
  const { funds } = manager;
  const goToProfile = (): void => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: manager._id,
      },
    });
  };
  const goToCompany = (): void => {
    NavigationService.navigate('CompanyDetails', {
      screen: 'CompanyProfile',
      params: {
        companyId: manager.company._id,
      },
    });
  };
  const goToFund = (fundId: string): void => {
    NavigationService.navigate('FundDetails', {
      fundId,
    });
  };
  return (
    <View style={styles.managerItem}>
      <FundUserInfo manager={manager} onPress={goToProfile} />
      <View style={styles.nameWrapper}>
        <Pressable onPress={goToProfile}>
          <PLabel
            label={`${manager.firstName} ${manager.lastName}`}
            textStyle={styles.nameLabel}
          />
        </Pressable>
        {manager.role === 'PROFESSIONAL' && (
          <View style={styles.proWrapper}>
            <ShieldCheckSvg />
            <PLabel label="PRO" textStyle={styles.proLabel} />
          </View>
        )}
      </View>
      <PLabel label={manager.position ?? ''} textStyle={styles.titleLabel} />
      <Pressable
        style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
        onPress={goToCompany}>
        <PLabel label={manager.company.name} textStyle={styles.desLabel} />
      </Pressable>
      {funds.length > 0 ? (
        <>
          <View style={styles.separator} />
          <PLabel label="FUNDS MANAGED" textStyle={styles.titleLabel} />
          <View style={styles.funds}>
            {funds.map((fund, index) => (
              <>
                <Pressable
                  key={fund._id}
                  style={({ pressed }) =>
                    pressed ? pStyles.pressedStyle : null
                  }
                  onPress={() => goToFund(fund._id)}>
                  <PLabel label={fund.name} textStyle={styles.desLabel} />
                </Pressable>
                {index < funds.length - 1 ? (
                  <PLabel label=", " textStyle={styles.desLabel} />
                ) : null}
              </>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

export default ManagerItem;

const styles = StyleSheet.create({
  managerItem: {
    marginBottom: 8,
    paddingHorizontal: 23,
    paddingBottom: 16,
    backgroundColor: BLACK,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  nameLabel: {
    ...Body1Bold,
    textTransform: 'capitalize',
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
    marginVertical: 16,
  },
  titleLabel: {
    ...Body3,
    marginBottom: 4,
  },
  funds: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
