import React, { FC } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import {
  PRIMARY,
  WHITE,
  SUCCESS,
  DANGER,
  GRAY100,
  WHITE12,
  SUCCESS30,
  DANGER30,
} from 'shared/src/colors';
import { Body1, Body2, Body3, Body4 } from 'mobile/src/theme/fonts';

import {
  FundSummary,
  FundManager,
  FundCompany,
  AssetClasses,
} from 'shared/graphql/fragments/fund';

import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';

export type Fund = FundSummary & FundManager & FundCompany;
export interface FundProfileInfo {
  fund: Fund;
  category?: string;
}

const FundProfileInfo: FC<FundProfileInfo> = ({ fund, category }) => {
  const { isFollowing, toggleFollow } = useFollowUser(fund.manager._id);

  const goToManager = (): void =>
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: fund.manager._id,
      },
    });

  const dollarFormatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <View>
      <View style={styles.imagesContainer}>
        <View style={styles.companyInfo}>
          <Avatar user={fund.company} size={40} style={styles.avatarImage} />
          <Text style={[styles.whiteText, Body1, styles.fund]}>
            {fund.name}
          </Text>
        </View>
        <View
          style={[
            styles.statusContainer,
            fund.status === 'OPEN'
              ? styles.openContainer
              : styles.closedContainer,
          ]}>
          <View
            style={[
              styles.statusIndicator,
              fund.status === 'OPEN' ? styles.open : styles.closed,
            ]}
          />
          <Text
            style={[
              styles.whiteText,
              Body4,
              fund.status === 'OPEN' ? styles.successText : styles.dangerText,
            ]}>
            {fund.status}
          </Text>
        </View>
        {/* <Text style={[styles.company, Body2]}>{fund.company.name}</Text> */}
      </View>
      <View style={styles.fundSummaryContainer}>
        <View style={[styles.fundDescriptorContainer, styles.rightSeparator]}>
          <Text style={[styles.title, styles.center]}>Asset Class</Text>
          <Text style={[styles.whiteText, styles.center]}>
            {AssetClasses[fund.class]}
          </Text>
        </View>
        <View style={[styles.fundDescriptorContainer]}>
          <Text style={[styles.title, styles.center]}>Strategy</Text>
          <Text style={[styles.whiteText, styles.center]}>{fund.strategy}</Text>
        </View>
        {category !== 'equity' && (
          <View style={[styles.fundDescriptorContainer, styles.leftSeparator]}>
            <Text style={[styles.title, styles.center]}>Minimum</Text>
            <Text style={[styles.whiteText, styles.center]}>
              ${dollarFormatter.format(fund.min)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.fundDetailsContainer}>
        {fund && fund.manager && (
          <Pressable onPress={goToManager}>
            <View style={styles.managerContainer}>
              <Avatar
                size={48}
                user={fund.manager}
                style={styles.managerAvatar}
              />
              <View>
                <View style={styles.manager}>
                  <Text style={[styles.whiteText, styles.name]}>
                    {`${fund.manager.firstName} ${fund.manager.lastName}`}
                  </Text>
                  {!isFollowing ? (
                    <>
                      <View style={styles.separator} />
                      <TouchableOpacity onPress={toggleFollow}>
                        <Text style={[styles.follow, Body3]}>Follow</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
                <View style={styles.managerInfo}>
                  <Text style={[styles.grayText, Body2]}>
                    {`${fund.manager.followerIds?.length ?? 0} Followers`}
                  </Text>
                  <View style={styles.separator} />
                  <Text style={[styles.grayText, Body2]}>
                    {`${fund.manager.postIds?.length ?? 0} Posts`}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        <Text style={[styles.overview, styles.whiteText, Body3]}>
          {fund.overview}
        </Text>
      </View>
    </View>
  );
};

export default FundProfileInfo;

const styles = StyleSheet.create({
  fundItem: {
    marginBottom: 16,
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#131313',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopColor: WHITE12,
    borderBottomColor: WHITE12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  companyInfo: {
    flex: 1,
    marginRight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    borderRadius: 4,
  },
  fundDetailsContainer: {
    padding: 16,
  },
  whiteText: {
    color: WHITE,
  },
  grayText: {
    color: GRAY100,
  },
  successText: {
    color: SUCCESS,
  },
  dangerText: {
    color: DANGER,
  },
  fund: {
    lineHeight: 21,
    marginLeft: 12,
  },
  company: {
    color: PRIMARY,
    marginBottom: 16,
  },
  overview: {
    lineHeight: 16,
    marginTop: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  openContainer: {
    backgroundColor: SUCCESS30,
  },
  closedContainer: {
    backgroundColor: DANGER30,
  },
  statusIndicator: {
    width: 12,
    aspectRatio: 1,
    borderRadius: 6,
    marginRight: 4,
  },
  open: {
    backgroundColor: SUCCESS,
  },
  closed: {
    backgroundColor: DANGER,
  },
  fundSummaryContainer: {
    flexDirection: 'row',
  },
  fundDescriptorContainer: {
    flex: 1,
    padding: 16,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tagStyle: {
    marginRight: 8,
  },
  managerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manager: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  managerAvatar: {
    marginRight: 12,
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY100,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 24,
  },
  follow: {
    textTransform: 'uppercase',
    color: PRIMARY,
  },
  center: {
    textAlign: 'center',
    marginTop: 4,
  },
  rightSeparator: {
    borderRightColor: WHITE12,
    borderRightWidth: 1,
  },
  leftSeparator: {
    borderLeftColor: WHITE12,
    borderLeftWidth: 1,
  },
  title: {
    textTransform: 'uppercase',
    color: GRAY100,
    fontSize: 10,
    letterSpacing: 2,
  },
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    fontWeight: 'bold',
    textTransform: 'none',
  },
  favorite: {
    marginLeft: 16,
  },
  name: {
    textTransform: 'capitalize',
    ...Body2,
  },
  contactBtn: {
    marginTop: 15,
  },
});
