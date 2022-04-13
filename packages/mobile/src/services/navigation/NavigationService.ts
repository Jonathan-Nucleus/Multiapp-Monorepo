import { CommonActions } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core';

interface NavigationServicesConfig {
  navigator?: NavigationContainerRef<{}>;
}

const config: NavigationServicesConfig = {};

export function setNavigator(nav: NavigationContainerRef<{}> | null): void {
  if (nav) {
    config.navigator = nav;
  }
}

export function navigate(
  routeName: string,
  params?: Record<string, unknown>,
): void {
  if (config.navigator && routeName) {
    let action = CommonActions.navigate({
      name: routeName,
      params,
    });
    config.navigator.dispatch(action);
  }
}

export function goBack(): void {
  if (config.navigator) {
    let action = CommonActions.goBack();
    config.navigator.dispatch(action);
  }
}
