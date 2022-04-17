import { gql, useMutation, MutationTuple } from '@apollo/client';

type WatchFundVariables = {
  watch: boolean;
  fundId: string;
};

type WatchFundData = {
  watchFund: boolean;
};

/**
 * GraphQL mutation that sets whether the current user is watching a particular
 * fund.
 *
 * @returns   GraphQL mutation.
 */
export function useWatchFund(): MutationTuple<
  WatchFundData,
  WatchFundVariables
> {
  return useMutation<WatchFundData, WatchFundVariables>(gql`
    mutation WatchFund($watch: Boolean!, $fundId: ID!) {
      watchFund(watch: $watch, fundId: $fundId)
    }
  `);
}
