import { gql, useQuery, QueryResult } from '@apollo/client';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import { User as GraphQLUser } from 'backend/graphql/users.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundManager,
} from 'mobile/src/graphql/fragments/fund';

export type CompanyMember = Pick<
  GraphQLCompany['members'][number],
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
>;
export type FollowUser = Pick<
  GraphQLUser,
  '_id' | 'firstName' | 'lastName' | 'position' | 'avatar'
>;
export type Fund = FundSummary & FundManager;
export type CompanyProfile = Pick<
  GraphQLCompany,
  | '_id'
  | 'name'
  | 'tagline'
  | 'overview'
  | 'avatar'
  | 'background'
  | 'postIds'
  | 'followerIds'
  | 'followingIds'
  | 'website'
  | 'linkedIn'
  | 'twitter'
> & {
  followers: FollowUser[];
  following: FollowUser[];
  funds: Fund[];
  members: CompanyMember[];
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
  companyId?: string,
): QueryResult<CompanyData, CompanyVariables> {
  return useQuery<CompanyData, CompanyVariables>(
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
      variables: { companyId: companyId ?? '' },
    },
  );
}
