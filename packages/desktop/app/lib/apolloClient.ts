import { onError } from "@apollo/client/link/error";
import {
  createHttpLink,
  ApolloClient,
  QueryOptions,
  ApolloQueryResult,
  OperationVariables,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { LocalStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import merge from "deepmerge";
import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";

const SCHEMA_BUILD_KEY = "prometheus-apollo-schema-build";

export type ApolloPageProps = {
  initialApolloState?: NormalizedCacheObject;
  graphqlToken?: string;
  graphqlUri?: string;
};

/**
 * Creates a new ApolloClient object for use on either the server or the client.
 * During the Next.js build phase, this returns a special build-phase client
 * that performs GraphQL queries directly rather than through the `/api/graphql`
 * application endpoint.
 *
 * @param token         The authentication token to make graphql requests.
 * @param initialCache  Optional apollo cache object to use for the client.
 *                      Defaults to a new InMemoryCache.
 *
 * @returns   An ApolloClient object.
 */
export function createApolloClient(
  token?: string,
  initialCache?: NormalizedCacheObject,
  graphqlUri?: string
): ApolloClient<NormalizedCacheObject> {
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

  const cache = new InMemoryCache();
  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([
      errorLink,
      createHttpLink({
        uri: graphqlUri || "/api/graphql",
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

  const initializeCache = (): void => {
    if (initialCache) {
      const data = client.extract();
      const mergedData = merge(data, initialCache);

      client.cache.restore(mergedData);
    }
  };

  if (typeof window !== "undefined") {
    const restoreCache = async () => {
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

      client.onClearStore(async () => {
        if (persistor) {
          await persistor.purge();
        }
      });

      initializeCache();
    };

    restoreCache();
  } else {
    initializeCache();
  }

  return client;
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
