import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Code from '../screens/Auth/Code';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import ForgotPass from '../screens/Auth/ForgotPass';
import Topic from '../screens/Auth/Topic';

const AuthStacks = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="Login">
      <Stack.Screen name="Code" component={Code} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Topic" component={Topic} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
    </Stack.Navigator>
  );
};

export default AuthStacks;
