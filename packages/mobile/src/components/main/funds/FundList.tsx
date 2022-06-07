import React from 'react';
import { StyleSheet, FlatList, Text } from 'react-native';

import { WHITE } from 'shared/src/colors';
import { Body2Bold } from 'mobile/src/theme/fonts';

import FundItem, { Fund } from './FundItem';
import type { FundSummary, Accredidation } from 'shared/graphql/fragments/fund';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

interface FundProps {
  funds: Fund[];
  accredited: Accredidation;
}

const FundList: React.FC<FundProps> = ({ funds, accredited }) => {
  if (funds.length === 0 || accredited === 'NONE') {
    return null;
  }

  return (
    <>
      <Text style={styles.title}>Funds</Text>
      <FlatList
        data={funds}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <FundItem fund={item} />}
        scrollEnabled={false}
        nestedScrollEnabled
      />
    </>
  );
};

export default FundList;

const styles = StyleSheet.create({
  title: {
    color: WHITE,
    ...Body2Bold,
    paddingLeft: 16,
    marginBottom: 10,
  },
});
