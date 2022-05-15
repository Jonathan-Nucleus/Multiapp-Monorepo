import { useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
import type { ApolloPersistOptions } from 'apollo3-cache-persist/types';
import {
  attachTokenObserver,
  detachTokenObserver,
  TokenAction,
} from 'mobile/src/utils/auth-token';
import { GRAPHQL_URI } from 'react-native-dotenv';

const typePolicies = {};

const cache = new InMemoryCache({
  typePolicies,
});

const persistor = new CachePersistor({
  cache:
    cache as unknown as ApolloPersistOptions<NormalizedCacheObject>['cache'], // Resolve type version error
  storage: new AsyncStorageWrapper(AsyncStorage),
});

export const useInitializeClient = () => {
  const [reset, setReset] = useState(false); // Toggle to force a restart
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    // Create an observer that is notified whenever the auth token changes to
    // trigger a reset of apollo client.
    const tokenObserver = (type: TokenAction) => {
      if (type === 'set') {
        setReset(!reset);
      } else if (type === 'cleared') {
        client?.clearStore();
      }
    };

    async function initializeCache() {
      await persistor.restore();
      const token = await EncryptedStorage.getItem('accessToken');

      const errorLink = onError(
        ({ graphQLErrors, networkError, operation }) => {
          if (graphQLErrors) {
            console.log('operation: ', operation);
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.log(
                '[GraphQL error]: Message: ',
                message,
                ', Location: ',
                locations,
                ', Path: ',
                path,
              );
            });
          }

          if (networkError) {
            console.log(
              'network error:',
              JSON.stringify(networkError, null, 2),
            );
          }
        },
      );

      const _client = new ApolloClient({
        link: from([
          errorLink,
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
