import { useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';

const typePolicies = {};

const cache = new InMemoryCache({
  typePolicies,
});

const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
});

const GQL_GATEWAY_URL = 'http://localhost:4000';

export const useInitializeClient = (token: string) => {
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);
  useEffect(() => {
    async function initializeCache() {
      await persistor.restore();
      const _client = new ApolloClient({
        link: from([
          createHttpLink({
            uri: GQL_GATEWAY_URL,
            headers: token && {
              authorization: `Bearer ${token}`,
            },
          }),
        ]),
        cache,
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network',
          },
        },
      });
      _client.onClearStore(async () => {
        await persistor.purge();
      });
      setClient(_client);
    }
    initializeCache();
  }, []);
  return client;
};
