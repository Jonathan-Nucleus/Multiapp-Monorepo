import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

const Stack = createStackNavigator();

import { AppStackScreenProps } from './AppNavigator';
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
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Login'>,
    AppStackScreenProps
  >,
) => ReactElement;
export type CodeScreen = (
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Code'>,
    AppStackScreenProps
  >,
) => ReactElement;
export type SignupScreen = (
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Signup'>,
    AppStackScreenProps
  >,
) => ReactElement;
export type TopicScreen = (
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Topic'>,
    AppStackScreenProps
  >,
) => ReactElement;
export type ForgotPassScreen = (
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'ForgotPass'>,
    AppStackScreenProps
  >,
) => ReactElement;
export type ResetPassScreen = (
  props: CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'ResetPass'>,
    AppStackScreenProps
  >,
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
