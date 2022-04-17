import React from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { BLACK } from 'shared/src/colors';
import ManagerItem, { Fund } from '../../../components/main/ManagerItem';
import { useFundManagers } from '../../../graphql/query/marketplace';
import { FundManagersScreen } from '../../../navigations/MarketplaceStack';

const Managers: FundManagersScreen = () => {
  const { data } = useFundManagers();
  const managers = data?.fundManagers?.managers;

  const keyExtractor = (item: Fund): string => item._id;
  const renderItem: ListRenderItem<Fund> = ({ item }) => {
    return <ManagerItem manager={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={managers ?? []}
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
