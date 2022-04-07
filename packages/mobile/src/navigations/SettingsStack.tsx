import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Settings from '../screens/Settings';
import SettingDetails from '../screens/Settings/Details';
import Help from '../screens/Help';
import CompanySettings from '../screens/Settings/CompanySettings';
import ProfileSettings from '../screens/Settings/ProfileSettings';
import Terms from '../screens/Terms';

const SettingsStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Settings"
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="SettingDetails" component={SettingDetails} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="CompanySettings" component={CompanySettings} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="Terms" component={Terms} />
    </Stack.Navigator>
  );
};

export default SettingsStacks;
