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
import {
  attachTokenObserver,
  detachTokenObserver,
} from 'mobile/src/utils/auth-token';
import { GRAPHQL_URI } from 'react-native-dotenv';

const typePolicies = {};

const cache = new InMemoryCache({
  typePolicies,
});

const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(EncryptedStorage),
});

export const useInitializeClient = () => {
  const [reset, setReset] = useState(false); // Toggle to force a restart
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    // Create an observer that is notified whenever the auth token changes to
    // trigger a reset of apollo client.
    const tokenObserver = () => {
      setReset(!reset);
    };

    async function initializeCache() {
      await persistor.restore();
      const token = await EncryptedStorage.getItem('accessToken');

      const _client = new ApolloClient({
        link: from([
          createHttpLink({
            uri: GRAPHQL_URI,
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
      attachTokenObserver(tokenObserver);
    }

    initializeCache();
    return () => detachTokenObserver(tokenObserver);
  }, [reset]);
  return client;
};
