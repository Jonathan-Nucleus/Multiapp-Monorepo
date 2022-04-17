import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import FundDetails from '../screens/Marketplace/Funds/FundDetails';
import MarketplaceStack from './MarketplaceStack';

const Stack = createStackNavigator();

type FundsStackParamList = {
  Marketplace: undefined;
  FundDetails: { fund: any };
};

export type FundDetailsScreen = (
  props: StackScreenProps<FundsStackParamList, 'FundDetails'>,
) => ReactElement;

export type MarketplaceScreen = (
  props: StackScreenProps<FundsStackParamList, 'Marketplace'>,
) => ReactElement;

const FundsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Marketplace">
      <Stack.Screen name="Marketplace" component={MarketplaceStack} />
      <Stack.Screen name="FundDetails" component={FundDetails} />
    </Stack.Navigator>
  );
};

export default FundsStack;
