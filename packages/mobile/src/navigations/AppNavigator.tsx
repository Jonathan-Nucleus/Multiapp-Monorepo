import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

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
import UserProfile from '../screens/Settings/UserProfile';
import CompanyProfile from '../screens/Settings/CompanyProfile';
import CreatePost from '../screens/Home/CreatePost';
import BecomePro from '../screens/Settings/BecomePro';
import Contact from '../screens/Settings/Contact';
import EditPhoto from '../screens/Settings/AccountAdmin/UserProfile/EditPhoto';
import EditProfile from '../screens/Settings/AccountAdmin/UserProfile/EditProfile';
import VerificationSuccess from '../screens/Settings/BecomePro/VerificationSuccess';
import EditCompanyProfile from '../screens/Settings/CompanyProfile/EditProfile';
import EditCompanyPhoto from '../screens/Settings/CompanyProfile/EditPhoto';

type AppParamList = {
  Auth: undefined;
  Main: undefined;
  UserProfile: undefined;
  CompanyProfile: undefined;
  CreatePost: undefined;
};
export type AppStackScreenProps = StackScreenProps<AppParamList>;

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<AppParamList> | null>(
    null,
  );

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
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="EditPhoto" component={EditPhoto} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen
          name="EditCompanyProfile"
          component={EditCompanyProfile}
        />
        <Stack.Screen name="EditCompanyPhoto" component={EditCompanyPhoto} />
        <Stack.Screen name="BecomePro" component={BecomePro} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen
          name="VerificationSuccess"
          component={VerificationSuccess}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
