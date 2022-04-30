import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import UserProfile from 'mobile/src/screens/UserDetails/UserProfile';
import EditUserProfile from 'mobile/src/screens/UserDetails/EditProfile';
import EditUserPhoto from 'mobile/src/screens/UserDetails/EditPhoto';

import type { MediaType } from 'backend/graphql/mutations.graphql';
import type { AppScreenProps } from './AppNavigator';

const Stack = createStackNavigator();
const UserDetailsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="UserProfile">
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
      <Stack.Screen name="EditUserPhoto" component={EditUserPhoto} />
    </Stack.Navigator>
  );
};

export default UserDetailsStack;

export type UserDetailsStackParamList = {
  UserProfile: {
    userId: string;
  };
  EditUserProfile: undefined;
  EditUserPhoto: {
    type: MediaType;
  };
};

export type UserDetailsScreenProps<
  RouteName extends keyof UserDetailsStackParamList = keyof UserDetailsStackParamList,
> = CompositeScreenProps<
  StackScreenProps<UserDetailsStackParamList, RouteName>,
  AppScreenProps
>;

export type UserProfileScreen = (
  props: UserDetailsScreenProps<'UserProfile'>,
) => ReactElement | null;

export type EditUserProfileScreen = (
  props: UserDetailsScreenProps<'EditUserProfile'>,
) => ReactElement | null;

export type EditUserPhotoScreen = (
  props: UserDetailsScreenProps<'EditUserPhoto'>,
) => ReactElement | null;
