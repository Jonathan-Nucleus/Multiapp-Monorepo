import React, { ReactElement, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ListRenderItem,
  List,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BGDARK, GRAY2, GRAY100, WHITE, BLACK, GRAY } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1, Body2, Body3, H6 } from 'mobile/src/theme/fonts';

import { useFetchFunds } from 'mobile/src/graphql/query/marketplace';
import FundItem, { Fund } from '../../../components/main/FundItem';

const Funds: FundsScreen = ({ navigation }) => {
  const { data } = useFetchFunds();

  const keyExtractor = (item: Fund): string => item._id;
  const renderItem: ListRenderItem<Fund> = ({ item }) => {
    return <FundItem fund={item} />;
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
  globalContainer: {
    flex: 1,
  },
  listHeaderText: {
    color: WHITE,
    padding: 16,
    fontWeight: 'bold',
  },
});
