import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';

import { WHITE, BLACK, BGDARK } from 'shared/src/colors';

import HomeScreen from '../screens/Home';
import HomeStack from './HomeStack';
import NotificationStack from './NotificationStack';
import SettingsStack from './SettingsStack';
import HomeSVG from '../assets/icons/tabHome.svg';
import GreyHomeSVG from '../assets/icons/tabGreyHome.svg';
import StarSVG from '../assets/icons/tabStar.svg';
import ChatSVG from '../assets/icons/tabChat.svg';
import BellSVG from 'shared/assets/images/bell.svg';
import GreyBellSVG from 'shared/assets/images/grey-bell.svg';
import ProfileSVG from '../assets/icons/tabProfile.svg';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const EmptyScreen = () => {
    return null;
  };

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
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <HomeSVG /> : <GreyHomeSVG />,
        }}
      />
      <Tab.Screen
        name="Star"
        component={EmptyScreen}
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
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ focused, size }) => <ChatSVG />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsStack}
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
