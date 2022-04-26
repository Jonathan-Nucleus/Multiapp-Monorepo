import { gql, useMutation, MutationTuple } from "@apollo/client";
import { MediaUpload, MediaType } from "backend/graphql/mutations.graphql";
import { Post, PostInput } from "backend/graphql/posts.graphql";

export const INVITE_USER = gql`
  mutation Invite($email: String!) {
    inviteUser(email: $email)
  }
`;

type WatchFundVariables = {
  fundId: string;
  watch: boolean;
};

type WatchFundData = {
  watchFund: boolean;
};

/**
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
