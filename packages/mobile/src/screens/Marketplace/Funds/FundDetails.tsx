import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { WHITE } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { FundDetailsScreen } from '../../../navigations/FundsStack';

const FundDetails: FundDetailsScreen = () => {
  return (
    <View style={pStyles.globalContainer}>
      <Text>1231231</Text>
    </View>
  );
};

export default FundDetails;

const styles = StyleSheet.create({
  listHeaderText: {
    color: WHITE,
    padding: 16,
    fontWeight: 'bold',
  },
});
