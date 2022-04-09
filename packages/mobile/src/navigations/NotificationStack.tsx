import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
const Stack = createStackNavigator();

import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';

type NotificationStackParamList = {
  Notification: undefined;
  Detail: undefined;
};

export type NotificationScreen = (
  props: StackScreenProps<NotificationStackParamList, 'Notification'>,
) => ReactElement;

export type NotificationDetailsScreen = (
  props: StackScreenProps<NotificationStackParamList, 'Detail'>,
) => ReactElement;

const NotificationStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Notification">
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Detail" component={NotificationDetail} />
    </Stack.Navigator>
  );
};

export default NotificationStacks;
