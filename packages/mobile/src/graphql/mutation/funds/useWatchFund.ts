import { useRef, useEffect, useState, useCallback } from 'react';
import { gql, useMutation, MutationTuple } from '@apollo/client';
import { UserProfile } from 'backend/graphql/users.graphql';
import { useAccount } from 'mobile/src/graphql/query/account';

type WatchFundVariables = {
  fundId: string;
  watch: boolean;
};

type WatchFundData = {
  watchFund: Pick<UserProfile, '_id' | 'watchlist'>;
};

interface WatchFundReturn {
  isWatching: boolean;
  toggleWatch: () => Promise<void>;
  watch: (watch: boolean) => Promise<void>;
}

/**
 * GraphQL mutation that sets whether the current user is watching a particular
 * fund.
 *
 * @returns   GraphQL mutation.
 */
export function useWatchFund(): MutationTuple<
  WatchFundData,
  WatchFundVariables
>;

/**
 * Utility hook that manages and updates states associated with a fund on a
 * user's watchlist. In particular, temporary state changes are managed while
 * network requests are made so that the user has a smooth user experience.
 * The state is then reverted if the network request or action fails. Successful
 * actions will also automatically trigger refetches for the useAccount hook.
 *
 * @returns   Object containing current watch state of the fund and functions
 *            to toggle or set the watch state.
 */
export function useWatchFund(id: string): WatchFundReturn;

export function useWatchFund(id?: unknown): unknown {
  const mutation = watchMutation();
  if (typeof id === 'undefined') {
    return mutation;
  }

  const fundId = id as string;
  const [watchFund] = mutation;

  const { data: accountData } = useAccount({ fetchPolicy: 'cache-only' });
  const isWatched = !!accountData?.account?.watchlistIds?.includes(fundId);
  const [watching, setWatching] = useState(isWatched);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Update the state
  if (isWatched != watching && !loading) {
    setWatching(isWatched);
  }

  const toggleWatch = useCallback(async (): Promise<void> => {
    setWatch(!isWatched);
  }, [isWatched]);

  const setWatch = useCallback(
    async (watch: boolean): Promise<void> => {
      // Update state immediately for responsiveness
      setWatching(watch);
      setLoading(true);

      const result = await watchFund({
        variables: {
          fundId,
          watch: watch,
        },
      });

      if (!result.data?.watchFund) {
        // Revert back to original state on error
        setWatching(isWatched);
      }

      // Allow time for graphql query for account to refetch and update
      setTimeout(() => {
        if (!mounted.current) {
          setLoading(false);
        }
      }, 500);
    },
    [isWatched],
  );

  return {
    isWatching: watching,
    toggleWatch,
    watch: setWatch,
  };
}

function watchMutation(): MutationTuple<WatchFundData, WatchFundVariables> {
  return useMutation<WatchFundData, WatchFundVariables>(
    gql`
      mutation WatchFund($watch: Boolean!, $fundId: ID!) {
        watchFund(watch: $watch, fundId: $fundId) {
          _id
          watchlistIds
        }
      }
    `,
    {
      refetchQueries: ['Account', 'Funds', 'Fund'],
    },
  );
}
