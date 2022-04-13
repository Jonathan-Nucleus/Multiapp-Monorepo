import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { WHITE } from 'shared/src/colors';

import { Body1 } from '../../../theme/fonts';
import FundItem from './FundItem';

const funds = [
  {
    _id: '12311',
    status: 'OPEN',
    title: 'Accelerated Opportunities L.P. Concentrated Growth Fund',
    star: false,
  },
  {
    _id: '123',
    status: 'OPEN',
    title: 'Accelerated Opportunities L.P. Concentrated Growth Fund',
    star: true,
  },
  {
    _id: '123111',
    status: 'OPEN',
    title: 'Accelerated Opportunities L.P. Concentrated Growth Fund',
    star: false,
  },
];

const Funds: React.FC = () => {
  return (
    <FlatList
      data={funds}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <FundItem fund={item} />}
      scrollEnabled={false}
      nestedScrollEnabled
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.text}>Funds</Text>
        </View>
      }
    />
  );
};

export default Funds;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
  },
  text: {
    color: WHITE,
    ...Body1,
  },
});
