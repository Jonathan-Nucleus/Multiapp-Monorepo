import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  CaretLeft,
  DotsThreeOutlineVertical,
  Star,
} from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PHeader from 'mobile/src/components/common/PHeader';

import pStyles from 'mobile/src/theme/pStyles';
import { Body2 } from 'mobile/src/theme/fonts';
import {
  BLACK,
  PRIMARYSTATE,
  WHITE,
  WHITE12,
  WHITE60,
} from 'shared/src/colors';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import FundProfileInfo from './FundProfileInfo';
import FundOverview from './FundOverview';
import FundsPlaceholder from '../../../../components/placeholder/FundsPlaceholder';

import { useFund } from 'mobile/src/graphql/query/marketplace/useFund';
import { useAccount } from 'mobile/src/graphql/query/account';
import { useWatchFund } from 'mobile/src/graphql/mutation/funds/useWatchFund';

import { FundDetailsScreen } from 'mobile/src/navigations/AppNavigator';

const Tab = createMaterialTopTabNavigator();
const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fundId } = route.params;
  const { data, loading } = useFund(fundId);
  const { data: accountData } = useAccount();
  const { isWatching, toggleWatch } = useWatchFund(fundId);
  const [tabviewHeight, setTabViewHeight] = useState<number>(500);

  const fund = data?.fund;
  if (!fund || loading) {
    return (
      <SafeAreaView style={pStyles.globalContainer}>
        <PHeader
          leftIcon={<CaretLeft size={32} color={WHITE} />}
          leftStyle={styles.sideStyle}
          onPressLeft={() => NavigationService.goBack()}
          containerStyle={styles.headerContainer}
        />
        <FundsPlaceholder />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        leftStyle={styles.sideStyle}
        onPressLeft={() => NavigationService.goBack()}
        containerStyle={styles.headerContainer}
      />
      <ScrollView>
        <FundProfileInfo fund={fund} />
        <View style={styles.actionBar}>
          <Pressable
            onPress={toggleWatch}
            style={({ pressed }) => [pressed ? styles.onPress : undefined]}>
            <Star
              size={24}
              color={isWatching ? PRIMARYSTATE : WHITE}
              style={styles.favorite}
              weight={isWatching ? 'fill' : 'regular'}
            />
          </Pressable>
          {/* Remove until actions have been defined.
            <DotsThreeOutlineVertical size={24} color={WHITE} />
            */}
        </View>
        <View
          style={{
            ...(tabviewHeight !== null
              ? { height: tabviewHeight }
              : { flex: 1 }),
          }}>
          <Tab.Navigator
            sceneContainerStyle={styles.tabContainer}
            screenOptions={({ route }) => ({
              swipeEnabled: false, // disabled swipe to scroll team members properly
              tabBarStyle: styles.tabBar,
              tabBarIndicatorStyle: styles.tabBarIndicator,
              tabBarActiveTintColor: WHITE,
              tabBarInactiveTintColor: WHITE60,
              tabBarLabel: ({ focused, color }) => (
                <Text
                  style={[
                    styles.tabBarLabel,
                    Body2,
                    { color },
                    focused ? styles.bold : {},
                  ]}>
                  {route.name}
                </Text>
              ),
            })}
            initialRouteName="FundOverview">
            <Tab.Screen
              name="Overview"
              component={() => (
                <FundOverview
                  fund={fund}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setTabViewHeight(height + styles.tabBar.height);
                  }}
                />
              )}
            />
            <Tab.Screen name="Documents" component={() => <></>} />
          </Tab.Navigator>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FundDetails;

const styles = StyleSheet.create({
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  headerContainer: {
    backgroundColor: BLACK,
    marginBottom: 0,
    height: 62,
  },
  sideStyle: {
    top: 16,
  },
  favorite: {},
  tabContainer: {
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
    height: 48,
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  tabBarLabel: {
    letterSpacing: 1.25,
  },
  bold: {
    fontWeight: 'bold',
  },
  onPress: {
    opacity: 0.5,
  },
});
