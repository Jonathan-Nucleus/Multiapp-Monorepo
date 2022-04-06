import { useEffect, useState } from "react";
import { onError } from "@apollo/client/link/error";
import {
  createHttpLink,
  ApolloClient,
  QueryOptions,
  ApolloQueryResult,
  OperationVariables,
  ApolloCache,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { LocalStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import merge from "deepmerge";

const SCHEMA_BUILD_KEY = "prometheus-apollo-schema-build";

let apolloClient: ApolloClient<NormalizedCacheObject> | null;

/**
 * Creates a new ApolloClient object for use on either the server or the client.
 * During the Next.js build phase, this returns a special build-phase client
 * that performs GraphQL queries directly rather than through the `/api/graphql`
 * application endpoint.
 *
 * @param token   The authentication token to make graphql requests.
 * @param cache   Optional apollo cache object to use for the client. Defaults
 *                to a new InMemoryCache.
 *
 * @returns   An ApolloClient object.
 */
function createApolloClient(
  token: string,
  cache?: ApolloCache<NormalizedCacheObject>
): ApolloClient<NormalizedCacheObject> {
  if (!cache) cache = new InMemoryCache();

  const fetcher = (
    input: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    if (typeof window !== "undefined") {
      return window.fetch(input, init);
    } else {
      return fetch(input, init);
    }
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      console.log("operation: ", operation);
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          "[GraphQL error]: Message: ",
          message,
          ", Location: ",
          locations,
          ", Path: ",
          path
        );
      });
    }

    if (networkError) {
      console.log("network error:", JSON.stringify(networkError, null, 2));
    }
  });

  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([
      errorLink,
      createHttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "/api/graphql",
        fetch: fetcher,
        headers: token && {
          authorization: `Bearer ${token}`,
        },
      }),
    ]),
    cache: cache,
    resolvers: {},
    defaultOptions: {
      mutate: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
    },
  });

  return client;
}

/**
 * Creates a new ApolloClient object specifically for client-side use. The new
 * client object is configured to persist the apollo cache to `localStorage`.
 * This method should only be called client-side. Server-side calls will result
 * in an error.
 *
 * @param token   The authentication token to make graphql requests.
 *
 * @returns   An ApolloClient object.
 */
async function createPersistedApolloClient(
  token: string
): Promise<ApolloClient<NormalizedCacheObject>> {
  const cache = new InMemoryCache();
  const persistor = new CachePersistor({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const serverBuild = process.env.SCHEMA_BUILD || "";
  const localBuild = window.localStorage.getItem(SCHEMA_BUILD_KEY);
  if (localBuild !== serverBuild.toString()) {
    // TODO: Update to see if there is a smart way to migrate the existing
    // apollo cache to the new schema
    await persistor.purge();
    localStorage.setItem(SCHEMA_BUILD_KEY, serverBuild);
  } else {
    await persistor.restore();
  }

  const client = createApolloClient(token, cache);
  client.onClearStore(async () => {
    if (persistor) {
      await persistor.purge();
    }
  });

  return client;
}

/**
 * Client-side only function used to create a singleton instance of an
 * apollo client. Repeat calls to this function with updated state data will
 * merge the new state data with the existing singleton instance. Note that the
 * singleton instance is also configured to persist the apollo client cache
 * data to localStorage.
 *
 * @param token         The authentication token to make graphql requests.
 * @param initialState  Optional state data that the client should be
 *                      initialized with.
 *
 * @returns   Singleton apollo client instance for client-side use.
 */
async function initializeApollo(
  token: string,
  initialState: NormalizedCacheObject | null = null
): Promise<ApolloClient<NormalizedCacheObject>> {
  const _apolloClient =
    apolloClient ?? (await createPersistedApolloClient(token));

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore(data);
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export type ApolloPageProps = {
  initialApolloState: NormalizedCacheObject;
  graphqlToken: string;
};

/**
 * Universal hook that provides an apollo client instance. When used
 * server-side, this will always immediately create return a new apollo client
 * instance with a fresh cache. When used client-side, a singleton apollo client
 * instance is provided whose cache object is configured to persist data to the
 * client localStorage. As the cache configuration is performed asynchronously,
 * an initial call to this function when used client-side may return a null
 * value. The hook will provide an updated client-object with a fully configured
 * cache once it is ready, triggering a rerender.
 */
export function useApollo(
  pageProps: ApolloPageProps
): ApolloClient<NormalizedCacheObject> {
  const { initialApolloState, graphqlToken } = pageProps;

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return createApolloClient(graphqlToken);
  }

  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    if (!client) {
      const getClient = async (): Promise<void> => {
        const client = await initializeApollo(graphqlToken, initialApolloState);
        setClient(client);
      };

      getClient();
    }
  }, [initialApolloState, graphqlToken]);

  return client || createApolloClient(graphqlToken);
}

export type SSRQueryResult<T> = ApolloQueryResult<T> & {
  client: ApolloClient<NormalizedCacheObject>;
  getApolloProps(): ApolloPageProps;
};

/**
 * Performs an asynchronous server-side GraphQL query, returning the query
 * result in addition to a props function that can optionally be used to expand
 * the resulting apollo cache state into the Next.js page props. This is
 * necessary in the event that rehydration of the server cache is desired on
 * the client side.
 *
 * Note that the `getApolloProps()` returns the queries that are only relevant
 * to the Apollo client object on which the query was executed. If one is not
 * passed in, a new client is created with a fresh cache. If it is important
 * to persist cache data between different ssr queries, make sure to pass along
 * the Apollo client object for each request. The specific client used in this
 * request is always returned with the query result from this function.
 *
 * @param options   The GraphQL query options.
 * @param token     An authentication token to use for any GraphQL requests
 * @param client    An optional Apollo client object on which to execute the
 *                  query,
 *
 * @returns   The GraphQL query result, the client used to execute the request,
 *            and a props function to expand the Apollo client state into
 *            Next.js page props.
 */
export async function ssrQuery<T, TVariables = OperationVariables>(
  options: QueryOptions<TVariables, T>,
  token: string,
  client?: ApolloClient<NormalizedCacheObject>
): Promise<SSRQueryResult<T>> {
  const apolloClient = client || createApolloClient(token);
  const result = await apolloClient.query(options);

  /**
   * Provides a props object that can be expanded into Next.js page props in
   * order to properly rehydrate cache data from the server on the client side.
   */
  const getApolloProps = (): ApolloPageProps => {
    return {
      initialApolloState: apolloClient.cache.extract(),
      graphqlToken: token,
    };
  };

  return {
    ...result,
    client: apolloClient,
    getApolloProps,
  };
}

export const getApolloClient = (
  token?: string
): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache({});
  let persistor: CachePersistor<NormalizedCacheObject> | null;
  if (typeof window !== "undefined") {
    persistor = new CachePersistor({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    });

    const serverBuild = process.env.SCHEMA_BUILD || "";
    const localBuild = window.localStorage.getItem(SCHEMA_BUILD_KEY);
    if (localBuild !== serverBuild.toString()) {
      // TODO: Update to see if there is a smart way to migrate the existing
      // apollo cache to the new schema
      persistor.purge();
      localStorage.setItem(SCHEMA_BUILD_KEY, serverBuild);
    } else {
      persistor.restore();
    }
  }

  const fetcher = (
    input: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    if (typeof window !== "undefined") {
      return window.fetch(input, init);
    } else {
      return fetch(input, init);
    }
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      console.log("operation: ", operation);
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          "[GraphQL error]: Message: ",
          message,
          ", Location: ",
          locations,
          ", Path: ",
          path
        );
      });
    }

    if (networkError) {
      console.log("network error:", JSON.stringify(networkError, null, 2));
    }
  });

  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([
      errorLink,
      createHttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "/api/graphql",
        fetch: fetcher,
        headers: token && {
          authorization: `Bearer ${token}`,
        },
      }),
    ]),
    cache: cache,
    resolvers: {},
    defaultOptions: {
      mutate: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
    },
  });

  client.onClearStore(async () => {
    if (persistor) {
      await persistor.purge();
    }
  });

  return client;
};
