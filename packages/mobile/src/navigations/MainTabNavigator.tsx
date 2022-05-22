import React, { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { House, Star, Chats, DotsThreeCircle } from 'phosphor-react-native';

import FundsSVG from 'shared/assets/images/fund.svg';
import GreyFundsSVG from 'shared/assets/images/grey-fund.svg';
import { WHITE, BLACK, GRAY400, GRAY700, WHITE12 } from 'shared/src/colors';

import { Home } from 'mobile/src/screens/Main/Home';
import WatchList from 'mobile/src/screens/Main/WatchList';
import MarketplaceTabs, { MarketplaceTabsParamList } from './MarketplaceTabs';
import ChatStack, { ChatStackParamList } from './ChatStack';
import MoreStack, { MoreStackParamList } from './MoreStack';
import { Body5Bold, Body5 } from '../theme/fonts';

import { useChatContext } from 'mobile/src/context/Chat';

import type { AuthenticatedScreenProps } from './AuthenticatedStack';

const Tab = createBottomTabNavigator();
const MainTabNavigator = () => {
  const client = useChatContext();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BLACK,
          borderTopWidth: 1,
          borderTopColor: WHITE12,
        },
        tabBarLabelStyle: {
          textTransform: 'uppercase',
        },
        tabBarShowLabel: true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>HOME</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <House size={size} color={WHITE} weight="fill" />
            ) : (
              <House size={size} color={GRAY400} />
            ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchList}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>watchlist</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Star size={size} color={WHITE} weight="fill" />
            ) : (
              <Star size={size} color={GRAY400} />
            ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceTabs}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>funds</Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <FundsSVG /> : <GreyFundsSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>messages</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Chats size={size} color={WHITE} weight="fill" />
            ) : (
              <Chats size={size} color={client ? GRAY400 : GRAY700} />
            ),
        }}
        listeners={{
          tabPress: (evt) => {
            if (!client) {
              console.log('Messenger disabled');
              evt.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>MORE</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <DotsThreeCircle size={size} color={WHITE} weight="fill" />
            ) : (
              <DotsThreeCircle size={size} color={GRAY400} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
  Marketplace: NavigatorScreenParams<MarketplaceTabsParamList> | undefined;
  Chat: NavigatorScreenParams<ChatStackParamList> | undefined;
  More: NavigatorScreenParams<MoreStackParamList> | undefined;
};

export type MainTabScreenProps<
  RouteName extends keyof MainTabParamList = keyof MainTabParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, RouteName>,
  AuthenticatedScreenProps
>;

export type HomeScreen = (
  props: MainTabScreenProps<'Home'>,
) => ReactElement | null;

export type WatchlistScreen = (
  props: MainTabScreenProps<'Watchlist'>,
) => ReactElement | null;

export type SettingsScreen = (
  props: MainTabScreenProps<'More'>,
) => ReactElement | null;

const styles = StyleSheet.create({
  text: {
    ...Body5,
    color: GRAY400,
    textTransform: 'uppercase',
  },
  bold: {
    ...Body5Bold,
    color: WHITE,
  },
});
