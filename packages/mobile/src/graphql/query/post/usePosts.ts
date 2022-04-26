import { gql, useQuery, QueryResult } from '@apollo/client';
import { PostCategory, Audience } from 'backend/graphql/posts.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

export type { Audience, PostCategory };

export type Post = PostSummary;
export type PostsData = {
  posts?: Post[];
};
type PostsVariables = {
  categories?: PostCategory[];
};

/**
 * GraphQL query that fetches posts for the current users home feed.
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  categories?: PostCategory[],
): QueryResult<PostsData, PostsVariables> {
  return useQuery<PostsData, PostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query Posts($categories: [PostCategory!]) {
        posts(categories: $categories) {
          ...PostSummaryFields
        }
      }
    `,
    {
      variables: { ...(categories ? { categories } : {}) },
    },
  );
}
