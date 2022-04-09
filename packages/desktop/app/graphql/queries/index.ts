import { gql } from "@apollo/client";

export const VERIFY_INVITE = gql`
  query VerifyInvite($code: String!) {
    verifyInvite(code: $code)
  }
`;

export const POSTS = gql`
  query Posts {
    posts {
      _id
      body
      mediaUrl
      mentionIds
      likeIds
      commentIds
      createdAt
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

// Posts Filtered
