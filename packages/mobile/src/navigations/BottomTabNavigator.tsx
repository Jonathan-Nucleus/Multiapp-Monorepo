import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';
import { House, Star, Chats, DotsThreeCircle } from 'phosphor-react-native';

import { WHITE, BLACK, BGDARK, GRAY400 } from 'shared/src/colors';

import HomeStack from './HomeStack';
import FundsStack from './FundsStack';
import SettingsStack from './SettingsStack';
import FundsSVG from 'shared/assets/images/fund.svg';
import GreyFundsSVG from 'shared/assets/images/grey-fund.svg';
import WatchList from '../screens/WatchList';
import Chat from '../screens/Chat';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
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
        name="HomeStack"
        component={HomeStack}
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
        component={FundsStack}
        options={{
          tabBarLabel: 'funds',
          tabBarIcon: ({ focused }) =>
            focused ? <FundsSVG /> : <GreyFundsSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
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
        component={SettingsStack}
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
}

BottomTabNavigator.propTypes = {
  focused: PropTypes.bool,
  size: PropTypes.number,
};
