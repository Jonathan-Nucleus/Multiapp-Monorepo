import { CommonActions } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';

import { AppParamList } from 'mobile/src/navigations/AppNavigator';

interface NavigationServicesConfig {
  navigator?: NavigationContainerRef<AppParamList>;
}

const config: NavigationServicesConfig = {};

export function setNavigator(
  nav: NavigationContainerRef<AppParamList> | null,
): void {
  if (nav) {
    config.navigator = nav;
  }
}

export function navigate(
  routeName: string,
  params?: Record<string, unknown>,
): void {
  if (config.navigator && routeName) {
    const action = CommonActions.navigate({
      name: routeName,
      params,
    });
    config.navigator.dispatch(action);
  }
}

export function goBack(): void {
  if (config.navigator) {
    const action = CommonActions.goBack();
    config.navigator.dispatch(action);
  }
}
