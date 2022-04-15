import { gql, useMutation, MutationTuple } from "@apollo/client";
import { MediaUpload, MediaType } from "backend/graphql/mutations.graphql";

export const FOLLOW_USER_COMPANY = gql`
  mutation FollowUserAsCompany(
    $follow: Boolean!
    $userId: ID!
    $asCompanyId: ID!
  ) {
    followUser(follow: $follow, userId: $userId, asCompanyId: $asCompanyId)
  }
`;
export const FOLLOW_COMPANY = gql`
  mutation FollowCompany($follow: Boolean!, $companyId: ID!) {
    followCompany(follow: $follow, companyId: $companyId)
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($follow: Boolean!, $userId: ID!) {
    followUser(follow: $follow, userId: $userId)
  }
`;

type FollowUserVariables = {
  follow: boolean;
  userId: string;
};

type FollowUserData = {
  likePost: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUser(): MutationTuple<
  FollowUserVariables,
  FollowUserData
> {
  return useMutation<FollowUserVariables, FollowUserData>(gql`
    mutation FollowUser($follow: Boolean!, $userId: ID!) {
      followUser(follow: $follow, userId: $userId)
    }
  `);
}

// FOLLOW USER
// Follow Company As Company
