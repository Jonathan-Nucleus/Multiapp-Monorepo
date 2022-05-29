import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ListRenderItem,
  SectionList,
} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { BLACK, WHITE, WHITE12 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { H6Bold } from 'mobile/src/theme/fonts';

import AccreditationLock from './AccreditationLock';
import FundItem from './FundItem';
import FundsPlaceholder from '../../../../components/placeholder/FundsPlaceholder';
import { FundsScreen } from 'mobile/src/navigations/MarketplaceTabs';

import {
  useFunds,
  Fund,
  AssetClasses,
} from 'shared/graphql/query/marketplace/useFunds';

const PLACE_HOLDERS = 7;

const Funds: FundsScreen = ({ navigation }) => {
  const focused = useIsFocused();

  const { data, refetch } = useFunds();
  const [focus, setFocus] = useState(focused);

  if (focused !== focus) {
    console.log('refetching funds');
    refetch();
    setFocus(focused);
  }

  const sectionedFunds = useMemo(() => {
    const sectionedData = AssetClasses.map((assetClass) => ({
      title: assetClass.label,
      data:
        data?.funds?.filter((fund) => fund.class === assetClass.value) ?? [],
    })).filter((section) => section.data.length > 0);

    return sectionedData;
  }, [data?.funds]);

  if (!data?.funds) {
    return (
      <View style={pStyles.globalContainer}>
        {[...Array(PLACE_HOLDERS)].map((_, index) => (
          <FundsPlaceholder key={index} />
        ))}
      </View>
    );
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
    <View style={styles.container}>
      <SectionList
        sections={sectionedFunds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Funds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  listHeader: {
    backgroundColor: BLACK,
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  listHeaderText: {
    color: WHITE,
    padding: 16,
    ...H6Bold,
  },
});
