import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/react-hooks';

import AppNavigator from './navigations/AppNavigator';
import { useInitializeClient } from './graphql/apolloClient';

const App = () => {
  const client = useInitializeClient();
  if (!client) {
    return null;
  }
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;
