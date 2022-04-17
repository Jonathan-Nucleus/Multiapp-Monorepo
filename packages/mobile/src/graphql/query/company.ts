import { gql, useQuery, QueryResult } from '@apollo/client';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import { VIEW_POST_FRAGMENT } from './post';

type CompanyVariables = {
  companyId: string;
};

export type FundManager = Pick<
  GraphQLCompany['funds'][number]['mmanager'],
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'followerIds' | 'postIds'
>;

export type Fund = Pick<
  GraphQLCompany['funds'][number],
  '_id' | 'name' | 'tags' | 'highlights'
> & {
  manager: FundManager;
};

export type CompanyMember = Pick<
  GraphQLCompany['members'][number],
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
>;

export type Company = Pick<
  GraphQLCompany,
  '_id' | 'name' | 'tagline' | 'overview' | 'avatar' | 'background'
> & {
  funds: Fund[];
  members: CompanyMember[];
};

export type CompanyData = {
  companyProfile?: Company;
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
      ${VIEW_POST_FRAGMENT}
      query CompanyProfile($companyId: ID!) {
        companyProfile(companyId: $companyId) {
          _id
          name
          tagline
          overview
          avatar
          background {
            url
            x
            y
            width
            height
            scale
          }
          funds {
            _id
            name
            tags
            highlights
            manager {
              _id
              avatar
              firstName
              lastName
              followerIds
              postIds
            }
          }
          members {
            _id
            firstName
            lastName
            position
            avatar
          }
          posts {
            ...ViewPostFields
          }
        }
      }
    `,
    {
      skip: !companyId,
      variables: { companyId },
    },
  );
}
