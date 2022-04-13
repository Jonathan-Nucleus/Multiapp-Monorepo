import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Settings from '../screens/Settings';
import Preferences from '../screens/Settings/Preferences';
import Help from '../screens/Help';
import CompanySettings from '../screens/Settings/CompanySettings';
import ProfileSettings from '../screens/Settings/ProfileSettings';
import Terms from '../screens/Settings/Terms';
import AccountAdmin from '../screens/Settings/AccountAdmin';
import InviteFriends from '../screens/Settings/InviteFriends';
import ChangePass from '../screens/Settings/AccountAdmin/ChangePass';

const SettingsStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Settings">
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="CompanySettings" component={CompanySettings} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="AccountAdmin" component={AccountAdmin} />
      <Stack.Screen name="InviteFriends" component={InviteFriends} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
    </Stack.Navigator>
  );
};

export default SettingsStacks;
