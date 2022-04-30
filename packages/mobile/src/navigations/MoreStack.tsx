import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import Settings from '../screens/Main/Settings';
import Preferences from '../screens/Main/Settings/Preferences';
import AccountAdmin from '../screens/Main/Settings/AccountAdmin';
import InviteFriends from '../screens/Main/Settings/InviteFriends';
import ChangePass from '../screens/Main/Settings/AccountAdmin/ChangePass';
import BecomePro from '../screens/Main/Settings/BecomePro';
import Contact from '../screens/Main/Settings/Contact';

import { MainTabScreenProps } from './MainTabNavigator';

const Stack = createStackNavigator();
const MoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="Settings">
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="AccountAdmin" component={AccountAdmin} />
      <Stack.Screen name="InviteFriends" component={InviteFriends} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="BecomePro" component={BecomePro} />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
};

export default MoreStack;

export type MoreStackParamList = {
  Settings: undefined;
  Preferences: undefined;
  AccountAdmin: undefined;
  InviteFriends: undefined;
  ChangePass: undefined;
  BecomePro: undefined;
  Contact: undefined;
};

export type MoreScreenProps<
  RouteName extends keyof MoreStackParamList = keyof MoreStackParamList,
> = CompositeScreenProps<
  StackScreenProps<MoreStackParamList, RouteName>,
  MainTabScreenProps
>;

export type SettingsScreen = (
  props: MoreScreenProps<'Settings'>,
) => ReactElement;
