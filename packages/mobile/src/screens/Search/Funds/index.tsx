import React, { FC } from 'react';
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
import {
  GRAY400,
  WHITE,
  PRIMARYSOLID,
  WHITE60,
  WHITE12,
} from 'shared/src/colors';

import { Fund } from 'backend/graphql/funds.graphql';
import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { Body1Bold, Body3 } from '../../../theme/fonts';
import pStyles from '../../../theme/pStyles';

interface FundsProps {
  funds: Fund[];
  search: string;
}

interface FundItemProps {
  fund: Fund;
}

const FundItem: FC<FundItemProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  return (
    <TouchableOpacity
      onPress={() => {
        NavigationService.navigate('FundDetails', { fundId: fund._id });
      }}>
      <View style={styles.item}>
        <View style={styles.fund}>
          <Avatar user={fund.company} size={64} style={styles.companyAvatar} />
          <View style={[styles.flex, styles.company]}>
            <Text style={styles.title}>{fund.name}</Text>
            <Text style={styles.type}>{fund.company.name}</Text>
          </View>
          <TouchableOpacity onPress={toggleWatch}>
            <Star
              size={24}
              color={isWatching ? PRIMARYSOLID : WHITE}
              weight={isWatching ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const renderItem: ListRenderItem<Fund> = ({ item }) => {
  return <FundItem fund={item} />;
};

const Funds: FC<FundsProps> = ({ funds, search }) => {
  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {funds.length} results for "{search}" in Funds
        </Text>
      )}
      <FlatList
        data={funds}
        renderItem={renderItem}
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
    borderBottomColor: WHITE12,
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
