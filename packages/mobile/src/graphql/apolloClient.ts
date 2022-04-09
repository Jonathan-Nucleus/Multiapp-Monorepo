import { useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';

const typePolicies = {};

const cache = new InMemoryCache({
  typePolicies,
});

const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(EncryptedStorage),
});

const GQL_GATEWAY_URL = 'http://localhost:4000';

export const useInitializeClient = () => {
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);
  useEffect(() => {
    async function initializeCache() {
      await persistor.restore();
      const token = await EncryptedStorage.getItem('accessToken');
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
