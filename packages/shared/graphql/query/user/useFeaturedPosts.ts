import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { PostCategory } from 'backend/graphql/posts.graphql';
import { User } from 'backend/graphql/users.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'shared/graphql/fragments/post';

type UserPostsVariables = {
  userId: string;
  featured: boolean;
};

export type Post = PostSummary;
export type UserPostsData = {
  userProfile?: Pick<User, '_id'> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches featured posts for the specified User.
 *
 * @param userId   The ID of the User.
 *
 * @returns   GraphQL query.
 */
export function useFeaturedPosts(
  userId: string,
): QueryResult<UserPostsData, UserPostsVariables> {
  return useQuery<UserPostsData, UserPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query UserFeaturedPosts($userId: ID!, $featured: Boolean!) {
        userProfile(userId: $userId) {
          _id
          posts(featured: $featured) {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: {
        userId,
        featured: true,
      },
    },
  );
}
