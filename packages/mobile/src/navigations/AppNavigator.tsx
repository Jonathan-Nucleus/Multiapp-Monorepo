import React, { ReactElement, useRef, useState, useEffect } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import * as NavigationService from '../services/navigation/NavigationService';
import {
  getToken,
  attachTokenObserver,
  detachTokenObserver,
  TokenAction,
} from 'mobile/src/utils/auth-token';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import UserDetailsStack, {
  UserDetailsStackParamList,
} from './UserDetailsStack';
import CompanyDetailsStack, {
  CompanyDetailsStackParamList,
} from './CompanyDetailsStack';
import PostDetailsStack, {
  PostDetailsStackParamList,
} from './PostDetailsStack';
import Contact from '../screens/Main/Settings/Contact';
import VerificationSuccess from '../screens/Main/Settings/BecomePro/VerificationSuccess';
import FundDetails from '../screens/Main/Marketplace/Funds/FundDetails';
import SearchTabs from './SearchTabs';
import Accreditation from '../screens/Accreditation';
import AccreditationResult from '../screens/Accreditation/AccreditationResult';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';

import { MediaType } from 'backend/graphql/mutations.graphql';

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

const Stack = createStackNavigator();
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
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="UserDetails" component={UserDetailsStack} />
        <Stack.Screen name="CompanyDetails" component={CompanyDetailsStack} />
        <Stack.Screen name="PostDetails" component={PostDetailsStack} />
        <Stack.Screen name="FundDetails" component={FundDetails} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen
          name="VerificationSuccess"
          component={VerificationSuccess}
        />
        <Stack.Screen name="Search" component={SearchTabs} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetail}
        />
        <Stack.Screen name="Accreditation" component={Accreditation} />
        <Stack.Screen
          name="AccreditationResult"
          component={AccreditationResult}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

type AppParamList = {
  Auth: undefined;
  Main: undefined;
  UserDetails: NavigatorScreenParams<UserDetailsStackParamList>;
  CompanyDetails: NavigatorScreenParams<CompanyDetailsStackParamList>;
  PostDetails: NavigatorScreenParams<PostDetailsStackParamList>;
  FundDetails: {
    fundId: string;
  };
  Contact: undefined;
  VerificationSuccess: undefined;
  Search: undefined;
  Notification: undefined;
  NotificationDetail: { postId: string; userId: string };
  Accreditation: undefined;
  AccreditationResult: undefined;
};

export type AppScreenProps<
  RouteName extends keyof AppParamList = keyof AppParamList,
> = StackScreenProps<AppParamList, RouteName>;

export type AuthScreen = (props: AppScreenProps<'Auth'>) => ReactElement;

export type MainScreen = (props: AppScreenProps<'Main'>) => ReactElement;

export type FundDetailsScreen = (
  props: AppScreenProps<'FundDetails'>,
) => ReactElement | null;

export type ContactScreen = (
  props: AppScreenProps<'Contact'>,
) => ReactElement | null;

export type VerificationSuccessScreen = (
  props: AppScreenProps<'VerificationSuccess'>,
) => ReactElement | null;

export type SearchScreen = (
  props: AppScreenProps<'Search'>,
) => ReactElement | null;

export type AccreditationScreen = (
  props: AppScreenProps<'Accreditation'>,
) => ReactElement;

export type AccreditationResultScreen = (
  props: AppScreenProps<'AccreditationResult'>,
) => ReactElement;

export type NotificationScreen = (
  props: AppScreenProps<'Notification'>,
) => ReactElement;

export type NotificationDetailsScreen = (
  props: AppScreenProps<'NotificationDetail'>,
) => ReactElement;
