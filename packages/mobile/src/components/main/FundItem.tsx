import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Star } from 'phosphor-react-native';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARY,
  WHITE,
  SUCCESS,
  DANGER,
  DANGER30,
  GRAY100,
  WHITE12,
  SUCCESS30,
  GRAY900,
  PRIMARYSTATE,
} from 'shared/src/colors';
import { Body1, Body3, Body4 } from 'mobile/src/theme/fonts';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';
import { FundSummary } from 'shared/graphql/fragments/fund';

interface FundItemProps {
  fund: FundSummary;
}

const FundItem: React.FC<FundItemProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.overview}>{fund.name}</Text>
        <View
          style={[
            styles.statusContainer,
            fund.status === 'OPEN' ? styles.bgSuccess : styles.bgDanger,
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
              fund.status === 'OPEN' ? styles.successText : styles.dangerText,
            ]}>
            {fund.status}
          </Text>
        </View>
      </View>
      <View style={styles.fundSummaryContainer}>
        <View style={[styles.fundDescriptorContainer, styles.rightSeparator]}>
          <Text style={styles.title}>Asset Class</Text>
          <Text style={styles.value}>Hedge Fund</Text>
        </View>
        <View style={[styles.fundDescriptorContainer, styles.rightSeparator]}>
          <Text style={styles.title}>Strategy</Text>
          <Text style={styles.value}>Multi-Strategy</Text>
        </View>
        <View style={styles.fundDescriptorContainer}>
          <Text style={styles.title}>Minimum</Text>
          <Text style={styles.value}>$500K</Text>
        </View>
      </View>
      <View style={styles.actionBar}>
        <PGradientButton
          label="View Fund Details"
          textStyle={styles.button}
          btnContainer={styles.buttonContainer}
          onPress={() =>
            NavigationService.navigate('FundDetails', {
              fundId: fund._id,
            })
          }
        />
        <Pressable
          onPress={toggleWatch}
          style={({ pressed }) => [pressed ? pStyles.pressedStyle : undefined]}>
          <Star
            size={24}
            color={isWatching ? PRIMARYSTATE : WHITE}
            style={styles.favorite}
            weight={isWatching ? 'fill' : 'regular'}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default FundItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY900,
    marginVertical: 8,
  },
  top: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  fundItem: {
    marginBottom: 16,
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
    marginTop: 16,
    lineHeight: 24,
  },
  company: {
    color: PRIMARY,
    marginBottom: 16,
  },
  overview: {
    color: WHITE,
    ...Body1,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  bgSuccess: {
    backgroundColor: SUCCESS30,
  },
  bgDanger: {
    backgroundColor: DANGER30,
  },
  statusIndicator: {
    width: 8,
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
    borderTopColor: WHITE12,
    borderBottomColor: WHITE12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  fundDescriptorContainer: {
    flex: 1,
    paddingVertical: 12,
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
  },
  rightSeparator: {
    borderRightColor: WHITE12,
    borderRightWidth: 1,
  },
  title: {
    textTransform: 'uppercase',
    color: GRAY100,
    ...Body4,
    textAlign: 'center',
  },
  value: {
    textTransform: 'uppercase',
    color: WHITE,
    ...Body3,
    textAlign: 'center',
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
  },
  favorite: {
    marginLeft: 16,
  },
});
