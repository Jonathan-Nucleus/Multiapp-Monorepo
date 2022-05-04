import React, { ReactElement } from 'react';
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
import { WHITE, BLACK, BGDARK, GRAY400 } from 'shared/src/colors';

import { Home } from 'mobile/src/screens/Main/Home';
import MarketplaceTabs from './MarketplaceTabs';
import ChatStack from './ChatStack';
import MoreStack, { MoreStackParamList } from './MoreStack';
import WatchList from 'mobile/src/screens/Main/WatchList';

import { AppScreenProps } from './AppNavigator';

const Tab = createBottomTabNavigator();
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BGDARK,
          borderTopWidth: 1,
          borderTopColor: BLACK,
        },
        tabBarLabelStyle: {
          color: WHITE,
          textTransform: 'uppercase',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'HOME',
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
          tabBarLabel: 'watchlist',
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
          tabBarLabel: 'funds',
          tabBarIcon: ({ focused }) =>
            focused ? <FundsSVG /> : <GreyFundsSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: 'messages',
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Chats size={size} color={WHITE} weight="fill" />
            ) : (
              <Chats size={size} color={GRAY400} />
            ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: 'MORE',
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
  Marketplace: undefined;
  Chat: undefined;
  More: NavigatorScreenParams<MoreStackParamList>;
};

export type MainTabScreenProps<
  RouteName extends keyof MainTabParamList = keyof MainTabParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, RouteName>,
  AppScreenProps
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
