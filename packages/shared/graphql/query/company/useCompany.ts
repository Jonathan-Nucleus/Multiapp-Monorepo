import { gql, useQuery, QueryResult } from "@apollo/client";
import { Company as GraphQLCompany } from "backend/graphql/companies.graphql";
import { User as GraphQLUser } from "backend/graphql/users.graphql";
import { PostSummary } from "shared/graphql/fragments/post";
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundManager,
} from "shared/graphql/fragments/fund";
import { useEffect, useState } from "react";

export type CompanyMember = Pick<
  GraphQLCompany["members"][number],
  "_id" | "firstName" | "lastName" | "avatar" | "position"
>;
export type FollowUser = Pick<
  GraphQLUser,
  "_id" | "firstName" | "lastName" | "position" | "avatar"
>;
export type Fund = FundSummary & FundManager;
export type CompanyProfile = Pick<
  GraphQLCompany,
  | "_id"
  | "name"
  | "tagline"
  | "overview"
  | "avatar"
  | "background"
  | "postIds"
  | "followerIds"
  | "followingIds"
  | "website"
  | "linkedIn"
  | "twitter"
  | "posts"
  | "followers"
  | "following"
> & {
  followers: FollowUser[];
  following: FollowUser[];
  funds: Fund[];
  members: CompanyMember[];
  posts: PostSummary[];
};

export type CompanyData = {
  companyProfile?: CompanyProfile;
};

type CompanyVariables = {
  companyId: string;
};

/**
 * GraphQL query that data for a particular company.
 *
 * @returns   GraphQL query.
 */
export function useCompany(
  companyId?: string
): QueryResult<CompanyData, CompanyVariables> {
  const [state, setState] = useState<CompanyData>();
  const { data, loading, ...rest } = useQuery<CompanyData, CompanyVariables>(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${FUND_MANAGER_FRAGMENT}
      query CompanyProfile($companyId: ID!) {
        companyProfile(companyId: $companyId) {
          _id
          name
          tagline
          overview
          avatar
          followerIds
          followingIds
          website
          linkedIn
          twitter
          followers {
            _id
            firstName
            lastName
            avatar
            position
          }
          following {
            _id
            firstName
            lastName
            avatar
            position
          }
          background {
            url
            x
            y
            width
            height
            scale
          }
          funds {
            ...FundSummaryFields
            ...FundManagerFields
          }
          members {
            _id
            firstName
            lastName
            position
            avatar
            company {
              _id
              name
              website
              linkedIn
              twitter
            }
          }
        }
      }
    `,
    {
      skip: !companyId,
      variables: { companyId: companyId ?? "" },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
