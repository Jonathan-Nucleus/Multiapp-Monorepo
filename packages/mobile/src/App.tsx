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

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const App = (): ReactElement => {
  useEffect(() => {
    start();
  }, []);

  const client = useInitializeClient();
  if (!client) {
    return <PAppContainer noScroll />;
  }

  StatusBar.setBarStyle('light-content');

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;
