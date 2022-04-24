import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { PostCategory } from 'backend/graphql/posts.graphql';
import { Company } from 'backend/graphql/companies.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

type CompanyPostsVariables = {
  companyId: string;
  categories?: PostCategory[];
};

export type Post = PostSummary;
export type CompanyPostsData = {
  companyProfile?: Pick<Company, '_id'> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches posts for the specified company.
 *
 * @param companyId   The ID of the company.
 * @param categories  Optional list of post categories to filter by.
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  companyId: string,
  categories?: PostCategory[],
): QueryResult<CompanyPostsData, CompanyPostsVariables> {
  return useQuery<CompanyPostsData, CompanyPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query CompanyPosts($companyId: ID!, $categories: [PostCategory!]) {
        companyProfile(companyId: $companyId) {
          _id
          posts(categories: $categories) {
            ...PostSummaryFragment
          }
        }
      }
    `,
    {
      variables: { companyId, ...(categories ? { categories } : {}) },
    },
  );
}
