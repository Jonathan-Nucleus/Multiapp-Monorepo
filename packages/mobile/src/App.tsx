import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/react-hooks';
import Toast from 'react-native-toast-message';

import AppNavigator from './navigations/AppNavigator';
import { useInitializeClient } from './graphql/apolloClient';

// Used only for demos. Comment out when not demoing.
console.disableYellowBox = true;

const App = () => {
  const client = useInitializeClient();
  if (!client) {
    return null;
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
