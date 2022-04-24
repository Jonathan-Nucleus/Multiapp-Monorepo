import { gql, useQuery, QueryResult } from '@apollo/client';
import { Fund as GraphQLFund } from 'backend/graphql/funds.graphql';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_COMPANY_FRAGMENT,
  FundSummary,
  FundCompany,
} from 'mobile/src/graphql/fragments/fund';

type FundVariables = {
  fundId: string;
};

export type FundDetails = FundSummary &
  FundCompany & {
    documents: GraphQLFund['documents'];
    team: Pick<
      GraphQLFund['team'][number],
      '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
    >[];
  };
export type FundData = {
  fund?: FundDetails;
};

/**
 * GraphQL query that fetches details for a particular fund.
 *
 * @returns   GraphQL query.
 */
export function useFund(fundId?: string): QueryResult<FundData, FundVariables> {
  return useQuery<FundData, FundVariables>(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${FUND_COMPANY_FRAGMENT}
      query Fund($fundId: ID!) {
        fund(fundId: $fundId) {
          ...FundSummaryFields
          ...FundCompanyFields
          documents {
            title
            url
            category
            date
            createdAt
          }
          team {
            _id
            firstName
            lastName
            avatar
            position
          }
        }
      }
    `,
    {
      skip: !fundId,
      variables: { fundId: fundId ?? '' },
    },
  );
}

type FundManagersVariables = never;
export type FundManager = Pick<
  GraphQLFund['manager'],
  | '_id'
  | 'firstName'
  | 'lastName'
  | 'avatar'
  | 'managedFundsIds'
  | 'followerIds'
  | 'postIds'
  | 'position'
  | 'role'
> & {
  company: Pick<
    Exclude<GraphQLFund['manager']['company'], undefined>,
    '_id' | 'name' | 'avatar'
  >;
};
export type FundList = Pick<FundSummary, '_id' | 'name'>[];
export type FundManagersData = {
  fundManagers?: {
    managers: FundManager[];
    funds: FundList;
  };
};

/**
 * GraphQL query that fetches fund managers for the current user.
 *
 * @returns   GraphQL query.
 */
export function useFundManagers(): QueryResult<
  FundManagersData,
  FundManagersVariables
> {
  return useQuery<FundManagersData, FundManagersVariables>(
    gql`
      query FundManagers {
        fundManagers {
          funds {
            _id
            name
          }
          managers {
            _id
            firstName
            lastName
            avatar
            role
            managedFundsIds
            followerIds
            postIds
            position
            company {
              _id
              name
              avatar
            }
          }
        }
      }
    `,
  );
}

type FundCompaniesVariables = never;
export type Company = Pick<
  GraphQLCompany,
  '_id' | 'name' | 'avatar' | 'postIds' | 'followerIds'
> & {
  funds: Pick<GraphQLCompany['funds'][number], '_id' | 'name' | 'managerId'>[];
  fundManagers: Pick<
    GraphQLCompany['fundManagers'][number],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
  >[];
};
export type FundCompanyData = {
  fundCompanies: Company[];
};

/**
 * GraphQL query that fetches all companies that have at least one fund.
 *
 * @returns   GraphQL query.
 */
export function useFundCompanies(): QueryResult<
  FundCompanyData,
  FundCompaniesVariables
> {
  return useQuery<FundCompanyData, FundCompaniesVariables>(
    gql`
      query FundCompanies {
        fundCompanies {
          _id
          name
          avatar
          postIds
          followerIds
          funds {
            _id
            name
            managerId
          }
          fundManagers {
            _id
            firstName
            lastName
            avatar
            position
          }
        }
      }
    `,
  );
}
