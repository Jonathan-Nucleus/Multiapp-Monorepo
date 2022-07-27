import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ListRenderItem,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Info } from 'phosphor-react-native';

import Disclosure from 'mobile/src/components/main/Disclosure';
import FundItem from 'mobile/src/components/main/funds/FundItem';
import pStyles from 'mobile/src/theme/pStyles';
import { BLACK, GRAY200, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import { H6Bold, H6, Body2 } from 'mobile/src/theme/fonts';

import AccreditationLock from './AccreditationLock';
import FundsPlaceholder from '../../../../components/placeholder/FundsPlaceholder';
import { FundsScreen } from 'mobile/src/navigations/MarketplaceTabs';

import {
  AssetClasses,
  Fund,
  useFunds,
} from 'shared/graphql/query/marketplace/useFunds';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccountContext } from 'shared/context/Account';
import PText from '../../../../components/common/PText';

const PLACE_HOLDERS = 7;

const ListEmptyComponent = () => {
  return (
    <View style={styles.listEmptyContainer}>
      <PText style={styles.emptyTitle}>{"We're working on it."}</PText>
      <PText style={styles.emptyDescription}>
        {
          'There are currently no funds available for accredited investors. We’re adding new funds every day, so be sure to check back!'
        }
      </PText>
    </View>
  );
};

const Funds: FundsScreen = () => {
  const account = useAccountContext();
  const focused = useIsFocused();

  const { data, refetch, loading } = useFunds();
  const [focus, setFocus] = useState(focused);
  const [disclosureVisible, setDisclosureVisible] = useState(false);
  const [firstItemId, setFirstItemId] = useState('');
  const sectionListRef = useRef<SectionList>(null);

  useEffect(() => {
    (async () => {
      const valueFromStorage = await AsyncStorage.getItem('fundsPageTutorial');
      if (data && data.funds && data.funds.length > 0 && !valueFromStorage) {
        setTimeout(() => {
          sectionListRef.current?.scrollToLocation({
            itemIndex: -1,
            sectionIndex: 1,
            viewPosition: 1,
            animated: true,
          });
          EventRegister.emit('fundsTabTutorial');
        }, 1500);
      }
    })();
  }, [data]);

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

    if (
      sectionedData &&
      sectionedData.length > 0 &&
      sectionedData[0].data &&
      sectionedData[0].data.length > 0
    ) {
      setFirstItemId(sectionedData[0].data[0]._id);
    }

    return sectionedData;
  }, [data?.funds]);

  if (account?.accreditation === 'NONE') {
    return <AccreditationLock />;
  }

  if (!data?.funds || (loading && data?.funds?.length === 0)) {
    return (
      <View style={pStyles.globalContainer}>
        {[...Array(PLACE_HOLDERS)].map((_, index) => (
          <FundsPlaceholder key={index} />
        ))}
      </View>
    );
  }

  if (data && data.funds && data.funds.length === 0) {
    return <ListEmptyComponent />;
  }

  const keyExtractor = (item: Fund): string => item._id;
  const renderItem: ListRenderItem<Fund> = ({ item }) => {
    return <FundItem fund={item} showTooltip={item._id === firstItemId} />;
  };

  return (
    <View style={styles.container}>
      <SectionList
        ref={sectionListRef}
        sections={sectionedFunds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>{title}</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            <Pressable
              onPress={() => setDisclosureVisible(true)}
              style={({ pressed }) => [
                styles.disclosureContainer,
                pressed ? pStyles.pressedStyle : null,
              ]}>
              <Info color={WHITE60} size={20} />
              <Text style={styles.disclosureText}>Prometheus Disclosures</Text>
            </Pressable>
            <Disclosure
              isVisible={disclosureVisible}
              onDismiss={() => setDisclosureVisible(false)}
            />
          </>
        }
        onScrollToIndexFailed={() => console.log('scroll index failed')}
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
  disclosureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  disclosureText: {
    color: WHITE60,
    marginLeft: 8,
  },
  listEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    ...H6,
    lineHeight: 30,
    letterSpacing: 1.5,
    textAlign: 'center',
    color: WHITE,
  },
  emptyDescription: {
    ...Body2,
    color: GRAY200,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.25,
    marginTop: 8,
  },
});
