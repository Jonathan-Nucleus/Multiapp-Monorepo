import React, { ReactElement, useEffect, useState } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import dayjs from 'dayjs';

import MainTabNavigator, { MainTabParamList } from './MainTabNavigator';
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
import SearchTabs, { SearchTabsParamList } from './SearchTabs';
import AccreditationStack, {
  AccreditationStackParamList,
} from './AccreditationStack';
import AccreditationResult from '../screens/Accreditation/AccreditationResult';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';
import Preferences from '../screens/Main/Settings/Preferences';
import ContactSuccess from '../screens/Main/Settings/Contact/ContactSuccess';

import {
  attachTokenObserver,
  detachTokenObserver,
  readToken,
} from 'mobile/src/services/PushNotificationService';
import { clearToken } from 'mobile/src/utils/auth-token';
import PAppContainer from 'mobile/src/components/common/PAppContainer';

import { MediaType } from 'backend/graphql/mutations.graphql';
import { Accreditation } from 'shared/graphql/mutation/account/useSaveQuestionnaire';

import { AccountProvider } from 'shared/context/Account';
import { ChatProvider } from 'mobile/src/context/Chat';
import { useChatToken } from 'shared/graphql/query/account/useChatToken';
import { useUpdateFcmToken } from 'shared/graphql/mutation/account';

import { AuthenticatedScreen, AppScreenProps } from './AppNavigator';

const Stack = createStackNavigator();
const AuthenticatedStack: AuthenticatedScreen = () => {
  const { data, loading: loadingToken, called: calledToken } = useChatToken();
  const [updateFcmToken] = useUpdateFcmToken();

  const token = data?.chatToken;
  if (calledToken && !loadingToken && !token) {
    console.log('Error fetching chat token');
  }

  useEffect(() => {
    const persistToken = async (): Promise<void> => {
      const fcmToken = await readToken();
      console.log('Read stored FCM token', fcmToken);
      if (fcmToken) {
        const { token, updatedAt } = fcmToken;

        // Only persist the token if it's fresh
        if (dayjs(updatedAt).isAfter(dayjs().subtract(5, 'minutes'))) {
          console.log('Persisting FCM token');
          try {
            const { data } = await updateFcmToken({
              variables: { fcmToken: token },
            });

            data?.updateFcmToken
              ? console.log('Updated FCM token')
              : console.log('Failure updating FCM token');
          } catch (e) {
            console.log('FCM token fail:', e);
          }
        }
      }
    };

    persistToken();
    const tokenObserver = (): void => {
      persistToken();
    };

    attachTokenObserver(tokenObserver);
    return () => detachTokenObserver(tokenObserver);
  }, [updateFcmToken]);

  const onUnauthenticated = () => {
    console.log('Unauthenticated');
    clearToken();
  };

  return (
    <AccountProvider
      onUnauthenticated={onUnauthenticated}
      loadingComponent={<PAppContainer noScroll />}>
      <ChatProvider token={token}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
          initialRouteName={'Main'}>
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
      </ChatProvider>
    </AccountProvider>
  );
};

export default AuthenticatedStack;

export type AuthenticatedStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  UserDetails: NavigatorScreenParams<UserDetailsStackParamList> | undefined;
  CompanyDetails:
    | NavigatorScreenParams<CompanyDetailsStackParamList>
    | undefined;
  PostDetails: NavigatorScreenParams<PostDetailsStackParamList> | undefined;
  FundDetails: {
    fundId: string;
  };
  VerificationSuccess: undefined;
  Search: NavigatorScreenParams<SearchTabsParamList> & {
    searchString?: string;
  };
  Notifications: undefined;
  NotificationDetail: { postId: string; userId: string };
  AccreditationStack:
    | NavigatorScreenParams<AccreditationStackParamList>
    | undefined;
  AccreditationResult: {
    accreditation: Accreditation;
  };
  Preferences: undefined;
  Contact: undefined;
  ContactSuccess: undefined;
};

export type AuthenticatedScreenProps<
  RouteName extends keyof AuthenticatedStackParamList = keyof AuthenticatedStackParamList,
> = CompositeScreenProps<
  StackScreenProps<AuthenticatedStackParamList, RouteName>,
  AppScreenProps
>;

export type MainScreen = (
  props: AuthenticatedScreenProps<'Main'>,
) => ReactElement;

export type FundDetailsScreen = (
  props: AuthenticatedScreenProps<'FundDetails'>,
) => ReactElement | null;

export type ContactScreen = (
  props: AuthenticatedScreenProps<'Contact'>,
) => ReactElement | null;

export type ContactSuccessScreen = (
  props: AuthenticatedScreenProps<'ContactSuccess'>,
) => ReactElement | null;

export type VerificationSuccessScreen = (
  props: AuthenticatedScreenProps<'VerificationSuccess'>,
) => ReactElement | null;

export type SearchScreen = (
  props: AuthenticatedScreenProps<'Search'>,
) => ReactElement | null;

export type NotificationScreen = (
  props: AuthenticatedScreenProps<'Notifications'>,
) => ReactElement;

export type NotificationDetailsScreen = (
  props: AuthenticatedScreenProps<'NotificationDetail'>,
) => ReactElement;

export type PreferencesScreen = (
  props: AuthenticatedScreenProps<'Preferences'>,
) => ReactElement;
