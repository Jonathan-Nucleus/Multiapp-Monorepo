import React, { FC, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { PRIMARYSTATE, WHITE } from 'shared/src/colors';
import {
  FundSummary,
  FundCompany,
  FundManager,
} from 'mobile/src/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

import { useAccount } from 'mobile/src/graphql/query/account';
import { useWatchFund } from 'mobile/src/graphql/mutation/funds';

type Fund = FundSummary & FundCompany & FundManager;
export interface FundItemProps {
  fund: Fund;
  showOverview?: boolean;
  showTags?: boolean;
  onClickFundDetails?: () => void;
}

const FundItem: FC<FundItemProps> = ({ fund, onClickFundDetails }) => {
  const { data: accountData } = useAccount();
  const [watchFund] = useWatchFund();

  const isWatched = !!accountData?.account?.watchlistIds?.includes(fund._id);
  const [watching, setWatching] = useState(isWatched);

  const toggleWatchlist = async (): Promise<void> => {
    if (!accountData) return;

    // Update state immediately for responsiveness
    setWatching(!isWatched);

    const result = await watchFund({
      variables: {
        fundId: fund._id,
        watch: !isWatched,
      },
      refetchQueries: ['Account'],
    });

    if (!result.data?.watchFund) {
      // Revert back to original state on error
      setWatching(isWatched);
    }
  };

  return (
    <View style={styles.fundItem}>
      <FundProfileInfo fund={fund} showOverview showTags />
      <View style={styles.actionBar}>
        <PGradientButton
          label="View Fund Details"
          textStyle={styles.button}
          btnContainer={styles.buttonContainer}
          onPress={onClickFundDetails}
        />
        <Pressable
          onPress={toggleWatchlist}
          style={({ pressed }) => [pressed ? styles.onPress : undefined]}>
          <Star
            size={24}
            color={watching ? PRIMARYSTATE : WHITE}
            style={styles.favorite}
            weight={watching ? 'fill' : 'regular'}
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
