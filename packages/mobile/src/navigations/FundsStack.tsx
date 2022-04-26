import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import FundDetails from '../screens/Marketplace/Funds/FundDetails';
import MarketplaceTabs from './MarketplaceTabs';
import Accreditation from 'mobile/src/screens/Settings/Accreditation';
import AccreditationLock from '../screens/Marketplace/Funds/AccreditationLock';
import AccreditationResult from '../screens/Settings/Accreditation/AccreditationResult';

const Stack = createStackNavigator();

export type FundsStackParamList = {
  Marketplace: undefined;
  FundDetails: { fundId: string };
  Accreditation: undefined;
  AccreditationLock: undefined;
};
export type FundsStackScreenProps = StackScreenProps<FundsStackParamList>;

export type FundDetailsScreen = (
  props: StackScreenProps<FundsStackParamList, 'FundDetails'>,
) => ReactElement;

export type MarketplaceScreen = (
  props: StackScreenProps<FundsStackParamList, 'Marketplace'>,
) => ReactElement;

export type AccreditationLockScreen = (
  props: StackScreenProps<FundsStackParamList, 'AccreditationLock'>,
) => ReactElement;

const FundsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Marketplace">
      <Stack.Screen name="Marketplace" component={MarketplaceTabs} />
      <Stack.Screen name="FundDetails" component={FundDetails} />
      <Stack.Screen name="Accreditation" component={Accreditation} />
      <Stack.Screen name="AccreditationLock" component={AccreditationLock} />
      <Stack.Screen
        name="AccreditationResult"
        component={AccreditationResult}
      />
    </Stack.Navigator>
  );
};

export default FundsStack;
