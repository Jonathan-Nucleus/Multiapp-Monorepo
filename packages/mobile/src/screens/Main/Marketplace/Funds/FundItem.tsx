import React, { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientOutlineButton from '../../../../components/common/PGradientOutlineButton';
import { PRIMARYSTATE, WHITE } from 'shared/src/colors';
import {
  FundSummary,
  FundCompany,
  FundManager,
} from 'shared/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';

type Fund = FundSummary & FundCompany & FundManager;

export interface FundItemProps {
  fund: Fund;
  showOverview?: boolean;
  showTags?: boolean;
  onClickFundDetails: () => void;
  category?: string;
}

const FundItem: FC<FundItemProps> = ({
  fund,
  category,
  onClickFundDetails,
}) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  return (
    <View style={styles.fundItem}>
      <FundProfileInfo fund={fund} category={category} />
      <View style={styles.actionBar}>
        <PGradientOutlineButton
          label={
            category === 'equity'
              ? 'View Strategy Overview'
              : 'View Fund Details'
          }
          textStyle={styles.button}
          btnContainer={styles.buttonContainer}
          onPress={onClickFundDetails}
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
  fundItem: {
    marginBottom: 16,
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
  onPress: {
    opacity: 0.5,
  },
});
