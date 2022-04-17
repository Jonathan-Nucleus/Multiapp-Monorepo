import { gql } from '@apollo/client';

export const VIEW_POST_FRAGMENT = gql`
  fragment ViewPostFields on Post {
    _id
    body
    categories
    mediaUrl
    mentionIds
    likeIds
    shareIds
    commentIds
    createdAt
    user {
      _id
      firstName
      lastName
      avatar
      position
      role
    }
  }
`;
