import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { WHITE } from 'shared/src/colors';
import { FundSummary } from 'mobile/src/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

export interface FundItemProps {
  fund: FundSummary;
  showOverview?: boolean;
  showTags?: boolean;
  onClickFundDetails?: () => void;
}

const FundItem: FC<FundItemProps> = ({ fund, onClickFundDetails }) => {
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
        <Star size={24} color={WHITE} style={styles.favorite} />
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
});
