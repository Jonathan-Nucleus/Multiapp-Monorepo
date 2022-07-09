import React, { ReactElement, useEffect, useState } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Welcome from '../screens/Auth/Welcome';
import Code from '../screens/Auth/Code';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import ForgotPass from '../screens/Auth/ForgotPass';
import ResetPass from '../screens/Auth/ResetPass';
import Topic from '../screens/Auth/Topic';

import type { AppScreenProps } from './AppNavigator';
import Terms from '../screens/Auth/Terms';
import UserType from '../screens/Auth/UserType';

const Stack = createStackNavigator();
const AuthStacks = () => {
  const [onboarded, setOnboarded] = useState<string | null>('');
  useEffect(() => {
    const checkOnboardedStatus = async () => {
      const status = (await AsyncStorage.getItem('onboarded_status')) || null;
      setOnboarded(status);
    };

    checkOnboardedStatus();
  }, []);

  if (onboarded === '') {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName={onboarded ? 'Login' : 'Welcome'}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Code" component={Code} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Topic" component={Topic} />
      <Stack.Screen name="UserType" component={UserType} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="ResetPass" component={ResetPass} />
    </Stack.Navigator>
  );
};

export default AuthStacks;

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Code: undefined;
  Signup: { code: string };
  Terms: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    inviteCode: string;
  };
  Topic: undefined;
  UserType: { topics: string[] };
  ForgotPass: undefined;
  ResetPass: { email: string };
};

export type AuthScreenProps<
  RouteName extends keyof AuthStackParamList = keyof AuthStackParamList,
> = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, RouteName>,
  AppScreenProps
>;

export type WelcomeScreen = (
  props: AuthScreenProps<'Welcome'>,
) => ReactElement | null;

export type LoginScreen = (
  props: AuthScreenProps<'Login'>,
) => ReactElement | null;

export type CodeScreen = (
  props: AuthScreenProps<'Code'>,
) => ReactElement | null;

export type SignupScreen = (
  props: AuthScreenProps<'Signup'>,
) => ReactElement | null;

export type TermsScreen = (
  props: AuthScreenProps<'Terms'>,
) => ReactElement | null;

export type TopicScreen = (
  props: AuthScreenProps<'Topic'>,
) => ReactElement | null;

export type UserTypeScreen = (
  props: AuthScreenProps<'UserType'>,
) => ReactElement | null;

export type ForgotPassScreen = (
  props: AuthScreenProps<'ForgotPass'>,
) => ReactElement | null;

export type ResetPassScreen = (
  props: AuthScreenProps<'ResetPass'>,
) => ReactElement | null;
