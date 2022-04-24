import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { PostCategory } from 'backend/graphql/posts.graphql';
import { User } from 'backend/graphql/users.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

type UserPostsVariables = {
  userId: string;
  categories?: PostCategory[];
};

export type Post = PostSummary;
export type UserPostsData = {
  userProfile?: Pick<User, '_id'> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches the account details for the current user
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  userId: string,
  categories?: PostCategory[],
): QueryResult<UserPostsData, UserPostsVariables> {
  return useQuery<UserPostsData, UserPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query UserPosts($userId: ID!, $categories: [PostCategory!]) {
        userProfile(userId: $userId) {
          _id
          posts(categories: $categories) {
            ...PostSummaryFragment
          }
        }
      }
    `,
    {
      variables: { userId, ...(categories ? { categories } : {}) },
    },
  );
}
