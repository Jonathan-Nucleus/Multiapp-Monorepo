import React, { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';

const Tab = createMaterialTopTabNavigator();
import {
  BLACK,
  WHITE,
  BGHEADER,
  PRIMARY,
  PRIMARYSTATE,
} from 'shared/src/colors';

import Funds from '../screens/Marketplace/Funds';
import Managers from '../screens/Marketplace/Managers';
import Companies from '../screens/Marketplace/Companies';
import MainHeader from '../components/main/Header';
import { Body3 } from '../theme/fonts';

type MarketplaceStackParamList = {
  Funds: undefined;
  Managers: undefined;
  Companies: undefined;
};

export type FundsScreen = (
  props: StackScreenProps<MarketplaceStackParamList, 'Funds'>,
) => ReactElement;

export type FundManagersScreen = (
  props: StackScreenProps<MarketplaceStackParamList, 'Managers'>,
) => ReactElement;

export type FundCompaniesScreen = (
  props: StackScreenProps<MarketplaceStackParamList, 'Companies'>,
) => ReactElement;

const MarketplaceStack = ({ navigation }) => {
  return (
    <View style={styles.globalContainer}>
      <MainHeader navigation={navigation} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: WHITE,
          tabBarInactiveTintColor: PRIMARY,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabBarLabel,
                Body3,
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

export default MarketplaceStack;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BGHEADER,
    marginTop: 0,
    paddingTop: 0,
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  tabBarLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1.25,
  },
  bold: {
    fontWeight: 'bold',
  },
});
