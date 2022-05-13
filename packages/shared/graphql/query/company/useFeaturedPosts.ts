import { gql, useQuery, QueryResult } from "@apollo/client";
import { Company } from "backend/graphql/companies.graphql";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";
import { useEffect, useState } from "react";

type CompanyPostsVariables = {
  companyId: string;
  featured: boolean;
};

export type Post = PostSummary;
export type CompanyPostsData = {
  companyProfile?: Pick<Company, "_id"> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches featured posts for the specified company.
 *
 * @param companyId   The ID of the company.
 *
 * @returns   GraphQL query.
 */
export function useFeaturedPosts(
  companyId: string,
): QueryResult<CompanyPostsData, CompanyPostsVariables> {
  const [state, setState] = useState<CompanyPostsData>();
  const { data, loading, ...rest } = useQuery<CompanyPostsData, CompanyPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query CompanyFeaturedPosts($companyId: ID!, $featured: Boolean!) {
        companyProfile(companyId: $companyId) {
          _id
          posts(featured: $featured) {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: {
        companyId,
        featured: true,
      },
    },
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
