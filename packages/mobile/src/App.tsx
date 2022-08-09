import 'react-native-gesture-handler';

import React, { ReactElement, useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/react-hooks';

import AppNavigator from './navigations/AppNavigator';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { useInitializeClient } from './services/apolloClient';
import { start } from './services/PushNotificationService';
import pStyles from 'mobile/src/theme/pStyles';

import Toast from 'mobile/src/services/ToastService';

import {
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
} from '@datadog/mobile-react-native';
import appsFlyer from 'react-native-appsflyer';
import { AFInit } from './utils/AppsFlyerUtil';

const config = new DdSdkReactNativeConfiguration(
  process.env.DD_TOKEN ?? '',
  process.env.ENV ?? 'dev',
  process.env.DD_APP_ID ?? '',
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors
);
config.site = 'US';
config.nativeCrashReportEnabled = true;

LogBox.ignoreAllLogs();

const App = (): ReactElement => {
  useEffect(() => {
    start();
    DdSdkReactNative.initialize(config);

    // AppsFlyer initialization!
    let AFGCDListener = appsFlyer.onInstallConversionData((res) => {
      const isFirstLaunch = res?.data?.is_first_launch;
      console.log(
        `First launch: ${isFirstLaunch && JSON.parse(isFirstLaunch) === true}`,
      );
    });

    AFInit();

    return () => {
      AFGCDListener();
    };
  }, []);

  const client = useInitializeClient();
  if (!client) {
    return <PAppContainer noScroll />;
  }

  StatusBar.setBarStyle('light-content');

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider style={pStyles.globalContainer}>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;
