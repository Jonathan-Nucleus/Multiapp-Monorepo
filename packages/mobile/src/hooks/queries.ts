import {
  gql,
  useMutation,
  useQuery,
  QueryResult,
  MutationTuple,
} from '@apollo/client';

import { Post, PostCategory } from 'backend/graphql/posts.graphql';

export const VERIFY_INVITE = gql`
  query VerifyInvite($code: String!) {
    verifyInvite(code: $code)
  }
`;

type FetchPostsVariables = {
  categories?: PostCategory[];
};

export type FetchPostsData = {
  posts?: (Pick<
    Post,
    | '_id'
    | 'body'
    | 'mediaUrl'
    | 'likeIds'
    | 'mentionIds'
    | 'commentIds'
    | 'shareIds'
    | 'createdAt'
    | 'categories'
  > & {
    user: Pick<
      Post['user'],
      '_id' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'position'
    > & {
      company: Pick<Post['user']['company'], '_id' | 'name'>;
    };
  })[];
};

/**
 * GraphQL query that fetches posts for the current users home feed.
 *
 * @returns   GraphQL query.
 */
export function useFetchPosts(): QueryResult<
  FetchPostsData,
  FetchPostsVariables
> {
  return useQuery<FetchPostsData, FetchPostsVariables>(gql`
    query Posts($categories: [PostCategory!]) {
      posts(categories: $categories) {
        _id
        body
        categories
        mediaUrl
        mentionIds
        likeIds
        commentIds
        shareIds
        createdAt
        user {
          _id
          firstName
          lastName
          avatar
          position
          role
          company {
            name
          }
        }
      }
    }
  `);
}
