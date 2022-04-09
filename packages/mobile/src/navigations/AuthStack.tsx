import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
const Stack = createStackNavigator();

import Code from '../screens/Auth/Code';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import ForgotPass from '../screens/Auth/ForgotPass';
import ResetPass from '../screens/Auth/ResetPass';
import Topic from '../screens/Auth/Topic';

type AuthStackParamList = {
  Login: undefined;
  Code: undefined;
  Signup: { code: string };
  Topic: undefined;
  ForgotPass: undefined;
  ResetPass: { email: string };
};

export type LoginScreen = (
  props: StackScreenProps<AuthStackParamList, 'Login'>,
) => ReactElement;
export type CodeScreen = (
  props: StackScreenProps<AuthStackParamList, 'Code'>,
) => ReactElement;
export type SignupScreen = (
  props: StackScreenProps<AuthStackParamList, 'Signup'>,
) => ReactElement;
export type TopicScreen = (
  props: StackScreenProps<AuthStackParamList, 'Topic'>,
) => ReactElement;
export type ForgotPassScreen = (
  props: StackScreenProps<AuthStackParamList, 'ForgotPass'>,
) => ReactElement;
export type ResetPassScreen = (
  props: StackScreenProps<AuthStackParamList, 'ResetPass'>,
) => ReactElement;

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
      <Stack.Screen name="ResetPass" component={ResetPass} />
    </Stack.Navigator>
  );
};

export default AuthStacks;
