import React, { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { Body2 } from '../theme/fonts';
import { BLACK, WHITE, PRIMARYSTATE, WHITE60 } from 'shared/src/colors';

import Funds from '../screens/Main/Marketplace/Funds';
import Managers from '../screens/Main/Marketplace/Managers';
import Companies from '../screens/Main/Marketplace/Companies';
import MainHeader from '../components/main/Header';

import { MainTabScreenProps } from './MainTabNavigator';

const Tab = createMaterialTopTabNavigator();
const MarketplaceTabs = () => {
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
        {/*
          Commenting this section out for now to align with updated requirements.
          Can look into adding section back in the future.

          <Tab.Screen name="Companies" component={Companies} />
         */}
      </Tab.Navigator>
    </View>
  );
};

export default MarketplaceTabs;

export type MarketplaceTabsParamList = {
  Funds: undefined;
  Managers: undefined;
  Companies: undefined;
};

export type MarketplaceScreenProps<
  RouteName extends keyof MarketplaceTabsParamList = keyof MarketplaceTabsParamList,
> = CompositeScreenProps<
  StackScreenProps<MarketplaceTabsParamList, RouteName>,
  MainTabScreenProps
>;

export type FundsScreen = (
  props: MarketplaceScreenProps<'Funds'>,
) => ReactElement | null;

export type FundManagersScreen = (
  props: MarketplaceScreenProps<'Managers'>,
) => ReactElement | null;

export type FundCompaniesScreen = (
  props: MarketplaceScreenProps<'Companies'>,
) => ReactElement | null;

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
