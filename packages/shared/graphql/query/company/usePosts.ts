import { gql, useQuery, QueryResult } from "@apollo/client";
import { PostCategory } from "backend/graphql/posts.graphql";
import { Company } from "backend/graphql/companies.graphql";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";
import { useEffect, useState } from "react";

type CompanyPostsVariables = {
  companyId: string;
  categories?: PostCategory[];
};

export type Post = PostSummary;
export type CompanyPostsData = {
  companyProfile?: Pick<Company, "_id"> & {
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
  categories?: PostCategory[]
): QueryResult<CompanyPostsData, CompanyPostsVariables> {
  const [state, setState] = useState<CompanyPostsData>();
  const { data, loading, ...rest } = useQuery<
    CompanyPostsData,
    CompanyPostsVariables
  >(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query CompanyPosts($companyId: ID!, $categories: [PostCategory!]) {
        companyProfile(companyId: $companyId) {
          _id
          posts(categories: $categories) {
            ...PostSummaryFields
            sharedPost {
              ...PostSummaryFields
            }
          }
        }
      }
    `,
    {
      variables: { companyId, ...(categories ? { categories } : {}) },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
