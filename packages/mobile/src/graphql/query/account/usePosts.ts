import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { PostCategory } from 'backend/graphql/posts.graphql';
import { User } from 'backend/graphql/users.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

type AccountPostsVariables = {
  categories?: PostCategory[];
};

export type Post = PostSummary;
export type AccountPostsData = {
  account?: Pick<User, '_id'> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches the account details for the current user
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  categories?: PostCategory[],
): QueryResult<AccountPostsData, AccountPostsVariables> {
  return useQuery<AccountPostsData, AccountPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query AccountPosts($categories: [PostCategory!]) {
        account {
          _id
          posts(categories: $categories) {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: { ...(categories ? { categories } : {}) },
    },
  );
}
