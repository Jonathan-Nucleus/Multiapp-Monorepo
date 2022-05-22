import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import CompanyProfile from 'mobile/src/screens/CompanyDetails/CompanyProfile';
import EditCompanyProfile from 'mobile/src/screens/CompanyDetails/EditProfile';
import EditCompanyPhoto from 'mobile/src/screens/CompanyDetails/EditPhoto';

import type { MediaType } from 'backend/graphql/mutations.graphql';
import type { AuthenticatedScreenProps } from './AuthenticatedStack';

const Stack = createStackNavigator();
const CompanyDetailsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="CompanyProfile">
      <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
      <Stack.Screen name="EditCompanyProfile" component={EditCompanyProfile} />
      <Stack.Screen name="EditCompanyPhoto" component={EditCompanyPhoto} />
    </Stack.Navigator>
  );
};

export default CompanyDetailsStack;

export type CompanyDetailsStackParamList = {
  CompanyProfile: {
    companyId: string;
  };
  EditCompanyProfile: {
    companyId: string;
  };
  EditCompanyPhoto: {
    type: MediaType;
    companyId: string;
  };
};

export type CompanyDetailsScreenProps<
  RouteName extends keyof CompanyDetailsStackParamList = keyof CompanyDetailsStackParamList,
> = CompositeScreenProps<
  StackScreenProps<CompanyDetailsStackParamList, RouteName>,
  AuthenticatedScreenProps
>;

export type CompanyProfileScreen = (
  props: CompanyDetailsScreenProps<'CompanyProfile'>,
) => ReactElement | null;

export type EditCompanyProfileScreen = (
  props: CompanyDetailsScreenProps<'EditCompanyProfile'>,
) => ReactElement | null;

export type EditCompanyPhotoScreen = (
  props: CompanyDetailsScreenProps<'EditCompanyPhoto'>,
) => ReactElement | null;
