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
  followUser: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUser(): MutationTuple<
  FollowUserData,
  FollowUserVariables
> {
  return useMutation<FollowUserData, FollowUserVariables>(gql`
    mutation FollowUser($follow: Boolean!, $userId: ID!) {
      followUser(follow: $follow, userId: $userId)
    }
  `);
}

type FollowCompanyVariables = {
  companyId: string;
  follow: boolean;
};

type FollowCompanyData = {
  followCompany: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useFollowCompany(): MutationTuple<
  FollowCompanyData,
  FollowCompanyVariables
> {
  return useMutation<FollowCompanyData, FollowCompanyVariables>(gql`
    mutation FollowCompany($follow: Boolean!, $companyId: ID!) {
      followCompany(follow: $follow, companyId: $companyId)
    }
  `);
}

type FollowUserAsCompanyVariables = {
  follow: boolean;
  userId: string;
  asCompanyId: string;
};

type FollowUserAsCompanyData = {
  followUser: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUserAsCompany(): MutationTuple<
  FollowUserAsCompanyData,
  FollowUserAsCompanyVariables
> {
  return useMutation<FollowUserAsCompanyData, FollowUserAsCompanyVariables>(gql`
    mutation FollowUserAsCompany(
      $follow: Boolean!
      $userId: ID!
      $asCompanyId: ID!
    ) {
      followUser(follow: $follow, userId: $userId, asCompanyId: $asCompanyId)
    }
  `);
}
