import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, ListRenderItem } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { WHITE } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { H6 } from 'mobile/src/theme/fonts';

import AccreditationLock from './AccreditationLock';
import FundItem from '../../../components/main/FundItem';
import { FundsScreen } from '../../../navigations/MarketplaceTabs';

import { useFunds, Fund } from 'mobile/src/graphql/query/marketplace/useFunds';

const Funds: FundsScreen = ({ navigation }) => {
  const { data, refetch } = useFunds();

  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  if (isFocused !== focusState) {
    // Refetch whenever the focus state changes to avoid refetching during
    // rerender cycles
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  if (data && data.funds && data.funds.length === 0) {
    return <AccreditationLock />;
  }

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
