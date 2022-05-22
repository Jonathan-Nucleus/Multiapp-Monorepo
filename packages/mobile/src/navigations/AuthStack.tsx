import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import Code from '../screens/Auth/Code';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import ForgotPass from '../screens/Auth/ForgotPass';
import ResetPass from '../screens/Auth/ResetPass';
import Topic from '../screens/Auth/Topic';

import type { AppScreenProps } from './AppNavigator';

const Stack = createStackNavigator();
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

export type AuthStackParamList = {
  Login: undefined;
  Code: undefined;
  Signup: { code: string };
  Topic: undefined;
  ForgotPass: undefined;
  ResetPass: { email: string };
};

export type AuthScreenProps<
  RouteName extends keyof AuthStackParamList = keyof AuthStackParamList,
> = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, RouteName>,
  AppScreenProps
>;

export type LoginScreen = (
  props: AuthScreenProps<'Login'>,
) => ReactElement | null;

export type CodeScreen = (
  props: AuthScreenProps<'Code'>,
) => ReactElement | null;

export type SignupScreen = (
  props: AuthScreenProps<'Signup'>,
) => ReactElement | null;

export type TopicScreen = (
  props: AuthScreenProps<'Topic'>,
) => ReactElement | null;

export type ForgotPassScreen = (
  props: AuthScreenProps<'ForgotPass'>,
) => ReactElement | null;

export type ResetPassScreen = (
  props: AuthScreenProps<'ResetPass'>,
) => ReactElement | null;
