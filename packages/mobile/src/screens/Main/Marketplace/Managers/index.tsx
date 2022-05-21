import React from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { BLACK } from 'shared/src/colors';
import ManagerItem from './ManagerItem';
import {
  useFundManagers,
  FundManager,
} from 'shared/graphql/query/marketplace/useFundManagers';
import { FundManagersScreen } from 'mobile/src/navigations/MarketplaceTabs';

const Managers: FundManagersScreen = () => {
  const { data } = useFundManagers();
  const managers = data?.fundManagers?.managers ?? [];
  const funds = data?.fundManagers?.funds ?? [];

  const keyExtractor = (item: FundManager): string => item._id;
  const renderItem: ListRenderItem<FundManager> = ({ item }) => {
    const fundManager = {
      ...item,
      funds: funds.filter((fund) => item.managedFundsIds?.includes(fund._id)),
    };
    return <ManagerItem manager={fundManager} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={managers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Managers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
});
