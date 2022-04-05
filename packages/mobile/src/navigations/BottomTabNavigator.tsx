import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';

import { WHITE, BLACK, BGDARK } from 'shared/src/colors';

import HomeScreen from '../screens/Home';
import NotificationStack from './NotificationStack';
import HomeSVG from '../assets/icons/tabHome.svg';
import GreyHomeSVG from '../assets/icons/tabGreyHome.svg';
import StarSVG from '../assets/icons/tabStar.svg';
import ChatSVG from '../assets/icons/tabChat.svg';
import BellSVG from 'shared/assets/images/bell.svg';
import GreyBellSVG from 'shared/assets/images/grey-bell.svg';
import ProfileSVG from '../assets/icons/tabProfile.svg';

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
          height: 72,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <HomeSVG /> : <GreyHomeSVG />,
        }}
      />
      <Tab.Screen
        name="Star"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => <StarSVG />,
        }}
      />
      <Tab.Screen
        name="Bell"
        component={NotificationStack}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <BellSVG /> : <GreyBellSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => <ChatSVG />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <ProfileSVG /> : <ProfileSVG />,
        }}
      />
    </Tab.Navigator>
  );
}

BottomTabNavigator.propTypes = {
  focused: PropTypes.bool,
  size: PropTypes.number,
};
