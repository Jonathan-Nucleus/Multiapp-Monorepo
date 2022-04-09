import { gql } from "@apollo/client";

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

// FOLLOW USER
// Follow Company As Company
