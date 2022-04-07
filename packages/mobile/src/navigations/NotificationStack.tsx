import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';

const NotificationStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Notification"
    >
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Detail" component={NotificationDetail} />
    </Stack.Navigator>
  );
};

export default NotificationStacks;
