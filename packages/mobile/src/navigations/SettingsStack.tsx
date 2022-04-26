import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
const Stack = createStackNavigator();

import Settings from '../screens/Settings';
import Preferences from '../screens/Settings/Preferences';
import Help from '../screens/Help';
import Terms from '../screens/Settings/Terms';
import AccountAdmin from '../screens/Settings/AccountAdmin';
import InviteFriends from '../screens/Settings/InviteFriends';
import ChangePass from '../screens/Settings/AccountAdmin/ChangePass';
import BecomePro from '../screens/Settings/BecomePro';
import Contact from '../screens/Settings/Contact';
import EditUserProfile from '../screens/Settings/AccountAdmin/EditProfile';
import Accreditation from '../screens/Settings/Accreditation';
import AccreditationResult from '../screens/Settings/Accreditation/AccreditationResult';

type SettingsStackParamList = {
  Accreditation: undefined;
  AccreditationResult: undefined;
};

export type AccreditationScreen = (
  props: StackScreenProps<SettingsStackParamList, 'Accreditation'>,
) => ReactElement;

export type AccreditationResultScreen = (
  props: StackScreenProps<SettingsStackParamList, 'AccreditationResult'>,
) => ReactElement;

const SettingsStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="Settings">
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Preferences" component={Preferences} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="AccountAdmin" component={AccountAdmin} />
      <Stack.Screen name="Accreditation" component={Accreditation} />
      <Stack.Screen
        name="AccreditationResult"
        component={AccreditationResult}
      />
      <Stack.Screen name="InviteFriends" component={InviteFriends} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
      <Stack.Screen name="BecomePro" component={BecomePro} />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
};

export default SettingsStacks;
