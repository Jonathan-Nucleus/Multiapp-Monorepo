import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import type {
  InvestorClass as InvestorClassType,
  FinancialStatus,
} from 'backend/graphql/enumerations.graphql';
import { Accreditation } from 'shared/graphql/mutation/account/useSaveQuestionnaire';

import InvestorClass from '../screens/Accreditation/InvestorClass';
import BaseFinancialStatus from '../screens/Accreditation/BaseFinancialStatus';
import IndividualAdvancedStatus from '../screens/Accreditation/IndividualAdvancedStatus';
import EntityAdvancedStatus from '../screens/Accreditation/EntityAdvancedStatus';
import AccreditationResult from '../screens/Accreditation/AccreditationResult';
import FAIntake from '../screens/Accreditation/FAIntake';

import type { AppScreenProps } from './AppNavigator';

import type {
  Audience,
  Post,
  PostCategory,
} from 'shared/graphql/query/post/usePosts';

const Stack = createStackNavigator();
const AccreditationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="InvestorClass">
      <Stack.Screen name="InvestorClass" component={InvestorClass} />
      <Stack.Screen
        name="BaseFinancialStatus"
        component={BaseFinancialStatus}
      />
      <Stack.Screen
        name="IndividualAdvancedStatus"
        component={IndividualAdvancedStatus}
      />
      <Stack.Screen
        name="EntityAdvancedStatus"
        component={EntityAdvancedStatus}
      />
      <Stack.Screen
        name="AccreditationResult"
        component={AccreditationResult}
      />
      <Stack.Screen name="FAIntake" component={FAIntake} />
    </Stack.Navigator>
  );
};

export default AccreditationStack;

export type AccreditationStackParamList = {
  InvestorClass: undefined;
  BaseFinancialStatus: {
    investorClass: Extract<InvestorClassType, 'INDIVIDUAL' | 'ENTITY'>;
  };
  IndividualAdvancedStatus: {
    investorClass: Extract<InvestorClassType, 'INDIVIDUAL' | 'ENTITY'>;
    baseStatus: FinancialStatus[];
  };
  EntityAdvancedStatus: {
    investorClass: Extract<InvestorClassType, 'INDIVIDUAL' | 'ENTITY'>;
    baseStatus: FinancialStatus[];
  };
  AccreditationResult: {
    investorClass: InvestorClassType;
    baseStatus: FinancialStatus[];
    accreditation: Accreditation;
    nextRoute?: 'IndividualAdvancedStatus' | 'EntityAdvancedStatus';
  };
  FAIntake: undefined;
};

export type AccreditationScreenProps<
  RouteName extends keyof AccreditationStackParamList = keyof AccreditationStackParamList,
> = CompositeScreenProps<
  StackScreenProps<AccreditationStackParamList, RouteName>,
  AppScreenProps
>;

export type InvestorClassScreen = (
  props: AccreditationScreenProps<'InvestorClass'>,
) => ReactElement | null;

export type BaseFinancialStatusScreen = (
  props: AccreditationScreenProps<'BaseFinancialStatus'>,
) => ReactElement | null;

export type IndividualAdvancedStatusScreen = (
  props: AccreditationScreenProps<'IndividualAdvancedStatus'>,
) => ReactElement | null;

export type EntityAdvancedStatusScreen = (
  props: AccreditationScreenProps<'EntityAdvancedStatus'>,
) => ReactElement | null;

export type AccreditationResultScreen = (
  props: AccreditationScreenProps<'AccreditationResult'>,
) => ReactElement | null;

export type FAIntakeScreen = (
  props: AccreditationScreenProps<'FAIntake'>,
) => ReactElement | null;
