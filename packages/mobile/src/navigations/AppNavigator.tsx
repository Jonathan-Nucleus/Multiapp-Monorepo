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
import AccreditationStack from './AccreditationStack';
import AccreditationResult from '../screens/Accreditation/AccreditationResult';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';
import Preferences from '../screens/Main/Settings/Preferences';
import ContactSuccess from '../screens/Main/Settings/Contact/ContactSuccess';

import { MediaType } from 'backend/graphql/mutations.graphql';
import { Accreditation } from 'shared/graphql/mutation/account/useSaveQuestionnaire';
import { useVerifyToken } from 'shared/graphql/query/account/useVerifyToken';

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

const Stack = createStackNavigator();
let verifying = false;

const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<AppParamList> | null>(
    null,
  );
  const [updateFcmToken] = useUpdateFcmToken();
  const [verifyToken] = useVerifyToken();

  useEffect(() => {
    NavigationService.setNavigator(navigationRef.current);

    let updateFcmHandle: NodeJS.Timeout | null = null;
    const tokenObserver = (action: TokenAction): void => {
      if (action === 'cleared') {
        setAuthenticated(false);
        navigationRef.current?.navigate('Auth');
      } else if (action === 'set') {
        // Update the FCM token whenever the auth token is set. Perform on a
        // timeout to allow sufficient time for apollo client to restore cache
        // and complete initialization.
        updateFcmHandle = setTimeout(async () => {
          try {
            const fcmToken = await AsyncStorage.getItem('@fcm_token');
            if (fcmToken) {
              const { data } = await updateFcmToken({
                variables: { fcmToken: fcmToken },
              });

              data?.updateFcmToken
                ? console.log('Updated fcm token')
                : console.log('Failure updating fcm token');
            }
          } catch (e) {
            console.log('fcm token fail:', e);
          }
        }, 1000);
      }
    };

    attachTokenObserver(tokenObserver);
    return () => {
      detachTokenObserver(tokenObserver);
      if (updateFcmHandle) {
        clearTimeout(updateFcmHandle);
      }
    };
  }, [updateFcmToken]);

  // Fetch authentication token to check whether or not the current user is
  // already logged in
  if (authenticated === null || !verifying) {
    (async (): Promise<void> => {
      const token = await getToken();
      setAuthenticated(!!token);
    })();
  }

  const onReady = () => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
    console.log('Running', routeNameRef.current);
    SplashScreen.hide();
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

  if (authenticated === null) {
    return <></>;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      <Stack.Navigator
        screenOptions={defaultScreenOptions}
        initialRouteName={authenticated ? 'Main' : 'Auth'}>
        <Stack.Screen name="Auth" component={AuthStack} />
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
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetail}
        />
        <Stack.Screen
          name="AccreditationStack"
          component={AccreditationStack}
        />
        <Stack.Screen
          name="AccreditationResult"
          component={AccreditationResult}
        />
        <Stack.Screen name="ContactSuccess" component={ContactSuccess} />
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
  VerificationSuccess: undefined;
  Search: {
    searchString?: string;
  };
  Notifications: undefined;
  NotificationDetail: { postId: string; userId: string };
  AccreditationStack: undefined;
  Accreditation: undefined;
  AccreditationResult: {
    accreditation: Accreditation;
  };
  Preferences: undefined;
  Contact: undefined;
  ContactSuccess: undefined;
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

export type ContactSuccessScreen = (
  props: AppScreenProps<'ContactSuccess'>,
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

export type NotificationScreen = (
  props: AppScreenProps<'Notifications'>,
) => ReactElement;

export type NotificationDetailsScreen = (
  props: AppScreenProps<'NotificationDetail'>,
) => ReactElement;

export type PreferencesScreen = (
  props: AppScreenProps<'Preferences'>,
) => ReactElement;
