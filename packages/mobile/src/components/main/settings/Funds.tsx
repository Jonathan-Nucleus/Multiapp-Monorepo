import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { WHITE } from 'shared/src/colors';

import { Body2 } from '../../../theme/fonts';
import FundItem from './FundItem';
import { useFetchFunds } from '../../../graphql/query/marketplace';

const Funds: React.FC = () => {
  const { data } = useFetchFunds();
  const funds = data?.funds ?? [];

  if (funds.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={styles.name}>Funds</Text>
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

export default Funds;

const styles = StyleSheet.create({
  name: {
    color: WHITE,
    ...Body2,
    paddingLeft: 16,
  },
});
