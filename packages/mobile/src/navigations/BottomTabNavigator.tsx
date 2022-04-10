import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';
import { House, Star, Chats, DotsThreeCircle } from 'phosphor-react-native';

import { WHITE, BLACK, BGDARK } from 'shared/src/colors';

import HomeStack from './HomeStack';
import SettingsStack from './SettingsStack';
import BellSVG from 'shared/assets/images/tabStar.svg';
import GreyBellSVG from 'shared/assets/images/tabStar.svg';
import Help from '../screens/Help';

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
              <House size={size} color={WHITE} />
            ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={Help}
        options={{
          tabBarLabel: 'watchlist',
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Star size={size} color={WHITE} weight="fill" />
            ) : (
              <Star size={size} color={WHITE} />
            ),
        }}
      />
      <Tab.Screen
        name="Funds"
        component={Help}
        options={{
          tabBarLabel: 'funds',
          tabBarIcon: ({ focused, size }) =>
            focused ? <BellSVG /> : <GreyBellSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Help}
        options={{
          tabBarLabel: 'messages',
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Chats size={size} color={WHITE} weight="fill" />
            ) : (
              <Chats size={size} color={WHITE} />
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
              <DotsThreeCircle size={size} color={WHITE} />
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
