import React from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { BLACK } from 'shared/src/colors';
import CompanyItem, { Fund } from '../../../components/main/CompanyItem';
import { useFetchFunds } from '../../../graphql/query/marketplace';
import { FundCompaniesScreen } from '../../../navigations/MarketplaceStack';

const Companies: FundCompaniesScreen = () => {
  const { data } = useFetchFunds();

  const keyExtractor = (item: Fund): string => item._id;
  const renderItem: ListRenderItem<Fund> = ({ item }) => {
    return <CompanyItem fund={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.funds ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Companies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
});
