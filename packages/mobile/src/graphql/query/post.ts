import { gql, useQuery, QueryResult } from '@apollo/client';
import { Post } from 'backend/graphql/posts.graphql';

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
    likes {
      _id
      firstName
      lastName
      avatar
      position
      role
      company {
        _id
        name
        avatar
      }
    }
  }
`;

type PostVariables = {
  postId: string;
};
export type PostData = {
  post?: Post;
};

/**
 * GraphQL query that fetches data for a specific post.
 *
 * @returns   GraphQL query.
 */
export function usePost(postId?: string): QueryResult<PostData, PostVariables> {
  return useQuery<PostData, PostVariables>(
    gql`
      query Post($postId: ID!) {
        post(postId: $postId) {
          _id
          body
          mediaUrl
          mentions {
            _id
            firstName
            lastName
          }
          likes {
            _id
            firstName
            lastName
            avatar
          }
          comments {
            body
            user {
              _id
              firstName
              lastName
              avatar
            }
            comment {
              body
              user {
                _id
                firstName
                lastName
                avatar
              }
              likes {
                _id
                firstName
                lastName
                avatar
              }
            }
            likes {
              _id
              firstName
              lastName
              avatar
            }
          }
          createdAt
          user {
            _id
            firstName
            lastName
            avatar
          }
        }
      }
    `,
    {
      skip: !postId,
      variables: { postId: postId ?? '' },
    },
  );
}
