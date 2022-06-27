import 'react-native-gesture-handler';

import React, { ReactElement, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/react-hooks';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigations/AppNavigator';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { useInitializeClient } from './services/apolloClient';
import { start } from './services/PushNotificationService';
import pStyles from 'mobile/src/theme/pStyles';

import {
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
} from '@datadog/mobile-react-native';
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

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const App = (): ReactElement => {
  useEffect(() => {
    start();
    DdSdkReactNative.initialize(config);
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
