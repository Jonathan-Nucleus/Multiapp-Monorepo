import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import * as NavigationService from '../services/navigation/NavigationService';

import {
  getToken,
  attachTokenObserver,
  detachTokenObserver,
  TokenAction,
} from 'mobile/src/utils/auth-token';

type NavigationParamList = {};

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef =
    useRef<NavigationContainerRef<NavigationParamList> | null>(null);

  useEffect(() => {
    NavigationService.setNavigator(navigationRef.current);
    const tokenObserver = (action: TokenAction): void => {
      if (action === 'cleared') {
        setAuthenticated(false);
        navigationRef.current?.dispatch();
      }
    };

    attachTokenObserver(tokenObserver);
    return () => detachTokenObserver(tokenObserver);
  }, []);

  // Fetch authentication token to check whether or not the current user is
  // already logged in
  (async (): Promise<void> => {
    const token = await getToken();
    setAuthenticated(!!token);
  })();

  const onReady = () => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
    console.log('Running', routeNameRef.current);
  };

  const onStateChange = async () => {
    const prev = routeNameRef.current;
    const current = navigationRef.current?.getCurrentRoute()?.name;
    console.log('Current: ', current);
    console.log('Prev: ', prev);
    routeNameRef.current = current;
  };
  useEffect(() => {
    if (authenticated) {
      NavigationService.navigate('Main');
    }
  }, [authenticated]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      <Stack.Navigator screenOptions={defaultScreenOptions}>
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
