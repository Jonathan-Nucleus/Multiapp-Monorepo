import React from 'react';
import { StyleSheet, FlatList, View, Text, ListRenderItem } from 'react-native';

import { WHITE } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { H6 } from 'mobile/src/theme/fonts';
import { useFetchFunds } from 'mobile/src/graphql/query/marketplace';
import FundItem, { Fund } from '../../../components/main/FundItem';
import { FundsScreen } from '../../../navigations/MarketplaceStack';

const Funds: FundsScreen = ({ navigation }) => {
  const { data } = useFetchFunds();

  const keyExtractor = (item: Fund): string => item._id;
  const renderItem: ListRenderItem<Fund> = ({ item }) => {
    return (
      <FundItem
        fund={item}
        onClickFundDetails={() =>
          navigation.navigate('FundDetails', { fundId: item._id })
        }
      />
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <FlatList
        data={data?.funds ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View>
            <Text style={[styles.listHeaderText, H6]}>Hedge Funds</Text>
          </View>
        }
      />
    </View>
  );
};

export default Funds;

const styles = StyleSheet.create({
  listHeaderText: {
    color: WHITE,
    padding: 16,
    fontWeight: 'bold',
  },
});
