import React, { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import { navigate } from 'mobile/src/services/navigation/NavigationService';
import { PRIMARYSTATE, WHITE } from 'shared/src/colors';
import {
  FundSummary,
  FundCompany,
  FundManager,
} from 'shared/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';

export type Fund = FundSummary & FundCompany & FundManager;

export interface FundItemProps {
  fund: Fund;
  showOverview?: boolean;
  showTags?: boolean;
}

const FundItem: FC<FundItemProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);

  const goToFund = (): void => {
    navigate('FundDetails', { fundId: fund._id });
  };

  return (
    <View>
      <FundProfileInfo fund={fund} showTags highlightManager />
      <View style={styles.actionBar}>
        <PGradientOutlineButton
          label={
            fund.limitedView ? 'View Strategy Overview' : 'View Fund Details'
          }
          textStyle={styles.button}
          btnContainer={styles.buttonContainer}
          onPress={goToFund}
        />
        <Pressable
          onPress={toggleWatch}
          style={({ pressed }) => [pressed ? styles.onPress : undefined]}>
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
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  onPress: {
    opacity: 0.5,
  },
});
