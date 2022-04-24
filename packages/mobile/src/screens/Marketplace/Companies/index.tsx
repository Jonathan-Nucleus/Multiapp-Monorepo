import React from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { BLACK } from 'shared/src/colors';
import CompanyItem from './CompanyItem';
import { useFundCompanies, Company } from '../../../graphql/query/marketplace';
import { FundCompaniesScreen } from '../../../navigations/MarketplaceTabs';

const Companies: FundCompaniesScreen = () => {
  const { data } = useFundCompanies();
  const companies = data?.fundCompanies ?? [];

  const keyExtractor = (item: Company): string => item._id;
  const renderItem: ListRenderItem<Company> = ({ item }) => {
    return <CompanyItem company={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={companies}
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
