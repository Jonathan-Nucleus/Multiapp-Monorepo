import React, { ReactElement, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { Body2 } from '../theme/fonts';
import { BLACK, PRIMARYSTATE, WHITE, WHITE60 } from 'shared/src/colors';

import Funds from '../screens/Main/Marketplace/Funds';
import Managers from '../screens/Main/Marketplace/Managers';
import MainHeader from '../components/main/Header';

import { MainTabScreenProps } from './MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pStyles from '../theme/pStyles';
import Tooltip from 'react-native-walkthrough-tooltip';
import { EventRegister } from 'react-native-event-listeners';

const Tab = createMaterialTopTabNavigator();
const MarketplaceTabs = () => {
  const [showTutorialFunds, setShowTutorialFunds] = useState(false);
  const [showTutorialManagers, setShowTutorialManagers] = useState(false);
  useEffect(() => {
    EventRegister.addEventListener('tutorialManagers', () => {
      setShowTutorialFunds(false);
      setShowTutorialManagers(true);
    });
    EventRegister.addEventListener('fundsTabTutorial', () => {
      setShowTutorialFunds(true);
    });
  }, []);

  const updateTutorialView = async (routeName: string) => {
    if (routeName === 'Funds') {
      setShowTutorialFunds(false);
      EventRegister.emit('tutorialFundItem');
    } else {
      setShowTutorialManagers(false);
      await AsyncStorage.setItem('fundsPageTutorial', JSON.stringify(true));
    }
  };

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
            <Tooltip
              isVisible={
                route.name === 'Funds'
                  ? showTutorialFunds
                  : showTutorialManagers
              }
              content={
                <View style={pStyles.tooltipContainer}>
                  <Text style={pStyles.tooltipText}>
                    {route.name === 'Funds'
                      ? 'Welcome to the marketplace! Browse funds on this tab.'
                      : 'Learn about the managers behind the funds.'}
                  </Text>
                  <Pressable
                    onPress={() => updateTutorialView(route.name)}
                    style={pStyles.tooltipButton}>
                    <Text style={pStyles.tooltipButtonText}>Next</Text>
                  </Pressable>
                </View>
              }
              contentStyle={pStyles.tooltipContent}
              placement="bottom"
              onClose={() => console.log('')}>
              <Text
                style={[
                  styles.tabBarLabel,
                  Body2,
                  { color },
                  focused ? styles.bold : {},
                ]}>
                {route.name}
              </Text>
            </Tooltip>
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
