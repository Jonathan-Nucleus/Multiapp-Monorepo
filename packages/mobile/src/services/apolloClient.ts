import { useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
import type { ApolloPersistOptions } from 'apollo3-cache-persist/types';
import {
  attachTokenObserver,
  detachTokenObserver,
  getToken,
  TokenAction,
} from 'mobile/src/utils/auth-token';
import { GRAPHQL_URI } from 'react-native-dotenv';

const cache = new InMemoryCache({
  typePolicies: {
    Post: {
      fields: {
        likes: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const persistor = new CachePersistor({
  cache:
    cache as unknown as ApolloPersistOptions<NormalizedCacheObject>['cache'], // Resolve type version error
  storage: new AsyncStorageWrapper(AsyncStorage),
});

export const useInitializeClient =
  (): ApolloClient<NormalizedCacheObject> | null => {
    const [reset, setReset] = useState(false); // Toggle to force a restart
    const [client, setClient] =
      useState<ApolloClient<NormalizedCacheObject> | null>(null);

    useEffect(() => {
      // Create an observer that is notified whenever the auth token changes to
      // trigger a reset of apollo client.
      const tokenObserver = async (type: TokenAction): Promise<void> => {
        if (type === 'set') {
          setReset(!reset);
        } else if (type === 'cleared') {
          console.log('Clearing apollo cache');
          await client?.clearStore();
          setReset(!reset);
        }
      };

      async function initializeCache(): Promise<void> {
        await persistor.restore();
        const token = await getToken();

        const errorLink = onError(
          ({ graphQLErrors, networkError, operation, response }) => {
            if (graphQLErrors) {
              console.log('operation: ', operation);
              graphQLErrors.forEach(({ message, locations, path }) => {
                console.log(
                  '[GraphQL error]: Message:',
                  message,
                  ', Location:',
                  locations,
                  ', Path:',
                  path,
                  ', Stack',
                  JSON.stringify(response, null, 2),
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

        console.log('Graphql env', GRAPHQL_URI);

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
