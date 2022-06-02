import React, { FC } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Star } from 'phosphor-react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import Tag from 'mobile/src/components/common/Tag';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARY,
  PRIMARYSTATE,
  WHITE,
  WHITE60,
  SUCCESS,
  DANGER,
  GRAY100,
  WHITE12,
  SUCCESS30,
  DANGER30,
} from 'shared/src/colors';
import { Body1, Body2, Body2Bold, Body3, Body4 } from 'mobile/src/theme/fonts';

import {
  FundSummary,
  FundManager,
  FundCompany,
  AssetClasses,
} from 'shared/graphql/fragments/fund';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';
import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';

export type Fund = FundSummary & FundManager & FundCompany;
export interface FundProfileInfo {
  fund: Fund;
  category?: string;
  showCompany?: boolean;
  showTags?: boolean;
}

const FundProfileInfo: FC<FundProfileInfo> = ({
  fund,
  category,
  showCompany = false,
  showTags = false,
}) => {
  const { isFollowing, toggleFollow } = useFollowUser(fund.manager._id);
  const { isWatching, toggleWatch } = useWatchFund(fund._id);

  const goToManager = (): void =>
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: fund.manager._id,
      },
    });

  const goToCompany = (): void =>
    NavigationService.navigate('CompanyDetails', {
      screen: 'CompanyProfile',
      params: {
        companyId: fund.company._id,
      },
    });

  const dollarFormatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <View>
      <View style={styles.imagesContainer}>
        <View style={styles.companyInfo}>
          <Avatar user={fund.company} size={40} style={styles.avatarImage} />
          <View style={styles.companyName}>
            <Text style={[styles.whiteText, Body1, styles.fund]}>
              {fund.name}
            </Text>
            {fund.feeder ? (
              <View style={[styles.row]}>
                <View style={[styles.statusIndicator, styles.special]} />
                <Text style={[styles.whiteText, Body2]}>
                  Feeder fund available
                </Text>
              </View>
            ) : null}
            {fund.offshore ? (
              <View style={styles.row}>
                <View style={[styles.statusIndicator, styles.special]} />
                <Text style={[styles.whiteText, Body2]}>
                  Offshore fund available
                </Text>
              </View>
            ) : null}
          </View>
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
      </View>
      <View style={styles.fundSummaryContainer}>
        <View style={[styles.fundDescriptorContainer, styles.rightSeparator]}>
          <Text style={[styles.title, styles.center]}>Asset Class</Text>
          <Text style={[styles.whiteText, styles.center]}>
            {AssetClasses.find((assetClass) => assetClass.value === fund.class)
              ?.label ?? ''}
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
      {showTags && fund.tags && fund.tags.length > 0 && (
        <View style={styles.tags}>
          {fund.tags.map((tag, index) => (
            <React.Fragment key={tag}>
              <Tag label={tag} viewStyle={styles.tagStyle} />
              {index < fund.tags.length - 1 ? (
                <Text style={styles.tagSeparator}>•</Text>
              ) : null}
            </React.Fragment>
          ))}
        </View>
      )}
      {showCompany ? (
        <View style={styles.actionBar}>
          <Pressable
            onPress={goToCompany}
            style={({ pressed }) => [
              styles.flex,
              pressed ? pStyles.pressedStyle : null,
            ]}>
            <Text style={styles.link}>View Company Profile</Text>
          </Pressable>
          <Pressable
            onPress={toggleWatch}
            style={({ pressed }) => [pressed ? pStyles.pressedStyle : null]}>
            <Star
              size={24}
              color={isWatching ? PRIMARYSTATE : WHITE}
              style={styles.favorite}
              weight={isWatching ? 'fill' : 'regular'}
            />
          </Pressable>
        </View>
      ) : null}
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
        {fund.highlights && fund.highlights.length > 0 && (
          <View style={styles.highlightContainer}>
            <PLabel label="Fund Highlights" textStyle={styles.sectionTitle} />
            {fund.highlights.map((item, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.bullet} />
                <PLabel
                  label={item}
                  viewStyle={styles.highlightLabelContainer}
                  textStyle={styles.highlightLabel}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default FundProfileInfo;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    flex: 1,
    paddingHorizontal: 12,
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
    lineHeight: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    ...Body2Bold,
  },
  highlightContainer: {
    marginTop: 16,
  },
  highlightLabel: {
    lineHeight: 16,
    ...Body3,
  },
  highlightItem: {
    marginVertical: 3,
    flexDirection: 'row',
    alignContent: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: WHITE,
    marginRight: 8,
    marginTop: 5,
  },
  highlightLabelContainer: {
    width: '90%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  openContainer: {
    backgroundColor: SUCCESS30,
  },
  closedContainer: {
    backgroundColor: DANGER30,
  },
  statusIndicator: {
    width: 8,
    aspectRatio: 1,
    borderRadius: 4,
    marginRight: 4,
  },
  open: {
    backgroundColor: SUCCESS,
  },
  closed: {
    backgroundColor: DANGER,
  },
  special: {
    backgroundColor: PRIMARYSTATE,
    marginRight: 8,
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
  link: {
    color: PRIMARY,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  tagStyle: {
    marginRight: 4,
    backgroundColor: 'transparent',
  },
  tagSeparator: {
    color: WHITE60,
    marginRight: 4,
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
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  favorite: {
    marginLeft: 16,
  },
  name: {
    textTransform: 'capitalize',
    ...Body2,
  },
});
