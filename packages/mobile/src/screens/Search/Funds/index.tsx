import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Star } from 'phosphor-react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import { GRAY400, WHITE, PRIMARYSOLID, WHITE60 } from 'shared/src/colors';

import { Fund } from 'backend/graphql/funds.graphql';
import { useWatchFund } from 'shared/graphql/mutation/account';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { Body1Bold, Body3 } from '../../../theme/fonts';
import pStyles from '../../../theme/pStyles';

interface FundsProps {
  funds: Fund[];
  search: string;
}

const Funds: React.FC<FundsProps> = ({ funds, search }) => {
  const [watchFund] = useWatchFund();

  const handleRemoveWatchList = async (id: string): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch: false, fundId: id },
      });
      if (data?.watchFund) {
      } else {
        console.log('err', data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const navigateToFund = async (id: string): Promise<void> => {
    NavigationService.navigate('FundDetails', { fundId: id });
  };

  const renderListItem: ListRenderItem<Fund> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateToFund(item._id)}>
        <View style={styles.item}>
          <View style={styles.fund}>
            <Avatar
              user={item.company}
              size={64}
              style={styles.companyAvatar}
            />
            <View style={[styles.flex, styles.company]}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.type}>{item.company.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveWatchList(item._id)}>
              <Star size={24} color={PRIMARYSOLID} weight="fill" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {funds.length} people results for "{search}" in Funds
        </Text>
      )}
      <FlatList
        data={funds}
        renderItem={renderListItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Funds;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    padding: 16,
    borderBottomColor: WHITE60,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  fund: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  companyAvatar: {
    borderRadius: 8,
  },
  flex: {
    flex: 1,
  },
  title: {
    ...Body1Bold,
    color: WHITE,
  },
  type: {
    color: GRAY400,
    ...Body3,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  alert: {
    color: WHITE60,
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
