import React, { ReactElement, useRef, useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  NavigationContainer,
  NavigatorScreenParams,
  DarkTheme,
} from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';
import { DdRumReactNavigationTracking } from '@datadog/mobile-react-navigation';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import analytics from '@react-native-firebase/analytics';

import * as NavigationService from '../services/navigation/NavigationService';
import {
  getToken,
  attachTokenObserver,
  detachTokenObserver,
  TokenAction,
} from 'mobile/src/utils/auth-token';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import UpdateModal from 'mobile/src/components/main/UpdateModal';

import AuthStack, { AuthStackParamList } from './AuthStack';
import AuthenticatedStack, {
  AuthenticatedStackParamList,
} from './AuthenticatedStack';

import { MediaType } from 'backend/graphql/mutations.graphql';
import { Accreditation } from 'shared/graphql/mutation/account/useSaveQuestionnaire';
import { useRequiresUpdate } from 'shared/graphql/query/user/useRequiresUpdate';

import { AccountProvider } from 'shared/context/Account';

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

const Stack = createStackNavigator();
const verifying = false;

const AppNavigator = (): React.ReactElement => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<AppParamList> | null>(
    null,
  );

  const { data: { requiresUpdate = false } = {} } = useRequiresUpdate(
    DeviceInfo.getVersion(),
    DeviceInfo.getBuildNumber(),
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
    DdRumReactNavigationTracking.startTrackingViews(navigationRef.current);
    SplashScreen.hide();
  };

  const onStateChange = async (): Promise<void> => {
    const prev = routeNameRef.current;
    const current = navigationRef.current?.getCurrentRoute()?.name;
    console.log('Current: ', current);
    console.log('Prev: ', prev);
    routeNameRef.current = current;

    if (prev !== current) {
      await analytics().logScreenView({
        screen_name: current,
        screen_class: current,
      });
    }
  };

  if (authenticated === null) {
    return <PAppContainer noScroll />;
  }

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={onReady}
        theme={DarkTheme}
        onStateChange={onStateChange}>
        <Stack.Navigator
          screenOptions={defaultScreenOptions}
          initialRouteName={authenticated ? 'Authenticated' : 'Auth'}>
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="Authenticated" component={AuthenticatedStack} />
        </Stack.Navigator>
      </NavigationContainer>
      {requiresUpdate ? <UpdateModal isVisible={true} /> : null}
    </>
  );
};

export default AppNavigator;

export type AppParamList = {
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
