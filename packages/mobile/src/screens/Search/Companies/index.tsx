import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';

import { WHITE, WHITE60 } from 'shared/src/colors';
import { H6Bold } from '../../../theme/fonts';

import { Company } from 'shared/graphql/query/marketplace/useFundCompanies';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import Avatar from 'mobile/src/components/common/Avatar';
import pStyles from '../../../theme/pStyles';

interface CompanyProps {
  companies: Company[];
  search: string;
}

export const renderItem: ListRenderItem<Company> = ({ item }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        NavigationService.navigate('CompanyDetails', {
          screen: 'CompanyProfile',
          params: { companyId: item._id },
        })
      }>
      <View style={styles.item}>
        <Avatar
          user={{ avatar: item.avatar }}
          size={60}
          style={styles.companyAvatar}
        />
        <View style={styles.rightItem}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Companies: React.FC<CompanyProps> = ({
  companies,
  search,
}: CompanyProps) => {
  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {companies.length} people results for "{search}" in Companies
        </Text>
      )}
      <FlatList
        data={companies}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Companies;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  companyAvatar: {
    borderRadius: 4,
  },
  rightItem: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    ...H6Bold,
    color: WHITE,
  },
  alert: {
    color: WHITE60,
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
