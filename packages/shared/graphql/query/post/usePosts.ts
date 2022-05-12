import { useState, useEffect } from 'react';
import { gql, useQuery, QueryResult } from '@apollo/client';
import {
  PostCategory,
  Audience,
  PostRoleFilter,
} from 'backend/graphql/posts.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'shared/graphql/fragments/post';

export type { Audience, PostCategory, PostRoleFilter };

export type Post = PostSummary;
export type PostsData = {
  posts?: Post[];
};
type PostsVariables = {
  categories?: PostCategory[];
  roleFilter?: PostRoleFilter;
};

/**
 * GraphQL query that fetches posts for the current users home feed.
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  categories?: PostCategory[],
  roleFilter?: PostRoleFilter,
): QueryResult<PostsData, PostsVariables> {
  const [state, setState] = useState<PostsData>();
  const { data, loading, ...rest } = useQuery<PostsData, PostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query Posts($categories: [PostCategory!], $roleFilter: PostRoleFilter) {
        posts(categories: $categories, roleFilter: $roleFilter) {
          ...PostSummaryFields
        }
      }
    `,
    {
      variables: { ...(categories ? { categories } : {}) },
    },
  );

  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);

  return { data: state, loading, ...rest };
}