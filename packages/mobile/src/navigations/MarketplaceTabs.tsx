import React, { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
import { BLACK, WHITE, PRIMARYSTATE, WHITE60 } from 'shared/src/colors';

import Funds from '../screens/Marketplace/Funds';
import Managers from '../screens/Marketplace/Managers';
import Companies from '../screens/Marketplace/Companies';
import MainHeader from '../components/main/Header';
import { Body2 } from '../theme/fonts';
import { MarketplaceScreen, FundsStackScreenProps } from './FundsStack';

type MarketplaceTabsParamList = {
  Funds: undefined;
  Managers: undefined;
  Companies: undefined;
};

export type FundsScreen = (
  props: CompositeScreenProps<
    MaterialTopTabScreenProps<MarketplaceTabsParamList, 'Funds'>,
    FundsStackScreenProps
  >,
) => ReactElement;

export type FundManagersScreen = (
  props: CompositeScreenProps<
    MaterialTopTabScreenProps<MarketplaceTabsParamList, 'Managers'>,
    FundsStackScreenProps
  >,
) => ReactElement;

export type FundCompaniesScreen = (
  props: CompositeScreenProps<
    MaterialTopTabScreenProps<MarketplaceTabsParamList, 'Companies'>,
    FundsStackScreenProps
  >,
) => ReactElement;

const MarketplaceTabs: MarketplaceScreen = () => {
  return (
    <View style={styles.globalContainer}>
      <MainHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
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
        initialRouteName="Funds">
        <Tab.Screen name="Funds" component={Funds} />
        <Tab.Screen name="Managers" component={Managers} />
        <Tab.Screen name="Companies" component={Companies} />
      </Tab.Navigator>
    </View>
  );
};

export default MarketplaceTabs;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
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
});
