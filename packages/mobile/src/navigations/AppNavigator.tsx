import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

import * as NavigationService from '../services/navigation/NavigationService';
import {
  getToken,
  attachTokenObserver,
  detachTokenObserver,
  TokenAction,
} from 'mobile/src/utils/auth-token';
import { useUpdateFcmToken } from 'shared/graphql/mutation/account';

import PAppContainer from 'mobile/src/components/common/PAppContainer';

import AuthStack, { AuthStackParamList } from './AuthStack';
import AuthenticatedStack, {
  AuthenticatedStackParamList,
} from './AuthenticatedStack';

import { MediaType } from 'backend/graphql/mutations.graphql';
import { Accreditation } from 'shared/graphql/mutation/account/useSaveQuestionnaire';
import { useVerifyToken } from 'shared/graphql/query/account/useVerifyToken';

import { AccountProvider } from 'shared/context/Account';

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

const Stack = createStackNavigator();
const verifying = false;

const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<AppParamList> | null>(
    null,
  );
  //const [verifyToken] = useVerifyToken();

  useEffect(() => {
    NavigationService.setNavigator(navigationRef.current);

    const tokenObserver = (action: TokenAction): void => {
      if (action === 'cleared') {
        setAuthenticated(false);
        navigationRef.current?.navigate('Auth');
      }
    };

    attachTokenObserver(tokenObserver);
    return () => detachTokenObserver(tokenObserver);
  }, [authenticated]);

  // Fetch authentication token to check whether or not the current user is
  // already logged in
  if (authenticated === null || !verifying) {
    (async (): Promise<void> => {
      const token = await getToken();
      setAuthenticated(!!token);
    })();
  }

  const onReady = (): void => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
    console.log('Running', routeNameRef.current);
    SplashScreen.hide();
  };

  const onStateChange = async (): Promise<void> => {
    const prev = routeNameRef.current;
    const current = navigationRef.current?.getCurrentRoute()?.name;
    console.log('Current: ', current);
    console.log('Prev: ', prev);
    routeNameRef.current = current;
  };

  if (authenticated === null) {
    return <PAppContainer noScroll />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      <Stack.Navigator
        screenOptions={defaultScreenOptions}
        initialRouteName={authenticated ? 'Authenticated' : 'Auth'}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Authenticated" component={AuthenticatedStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

type AppParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Authenticated: NavigatorScreenParams<AuthenticatedStackParamList> | undefined;
};

export type AppScreenProps<
  RouteName extends keyof AppParamList = keyof AppParamList,
> = StackScreenProps<AppParamList, RouteName>;

export type AuthScreen = (props: AppScreenProps<'Auth'>) => ReactElement;

export type AuthenticatedScreen = (
  props: AppScreenProps<'Authenticated'>,
) => ReactElement;
