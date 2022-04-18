import { gql, useQuery, QueryResult } from '@apollo/client';
import { Fund as GraphQLFund } from 'backend/graphql/funds.graphql';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';

type FetchFundsVariables = never;

export type Fund = Pick<
  GraphQLFund,
  | '_id'
  | 'name'
  | 'level'
  | 'status'
  | 'highlights'
  | 'overview'
  | 'tags'
  | 'background'
> & {
  manager: Pick<
    GraphQLFund['manager'],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'followerIds' | 'postIds'
  >;
  company: Pick<
    GraphQLFund['company'],
    '_id' | 'name' | 'avatar' | 'background'
  >;
};

export type FetchFundsData = {
  funds?: Fund[];
};

/**
 * GraphQL query that fetches funds for the current user. These are
 * automatically filtered by the user's accreditation status.
 *
 * @returns   GraphQL query.
 */
export function useFetchFunds(): QueryResult<
  FetchFundsData,
  FetchFundsVariables
> {
  return useQuery<FetchFundsData, FetchFundsVariables>(gql`
    query Funds {
      funds {
        _id
        name
        level
        status
        highlights
        overview
        tags
        background {
          url
          x
          y
          width
          height
          scale
        }
        manager {
          _id
          firstName
          lastName
          avatar
          followerIds
          postIds
        }
        company {
          _id
          name
          avatar
          background {
            url
            x
            y
            width
            height
            scale
          }
        }
      }
    }
  `);
}

type FundVariables = {
  fundId: string;
};

export type FundDetails = Pick<
  GraphQLFund,
  '_id' | 'name' | 'highlights' | 'overview' | 'tags' | 'documents' | 'status'
> & {
  manager: Pick<
    GraphQLFund['manager'],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'postIds' | 'followerIds'
  >;
  team: Pick<
    GraphQLFund['team'][number],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
  >[];
  company: Pick<GraphQLFund['company'], '_id' | 'name' | 'avatar'> & {
    background: Pick<
      Exclude<GraphQLFund['company']['background'], undefined>,
      'url'
    >;
  };
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
      query Fund($fundId: ID!) {
        fund(fundId: $fundId) {
          _id
          name
          highlights
          overview
          tags
          status
          documents {
            title
            url
            category
            date
            createdAt
          }
          manager {
            _id
            firstName
            lastName
            avatar
            postIds
            followerIds
          }
          team {
            _id
            firstName
            lastName
            avatar
            position
          }
          company {
            _id
            name
            avatar
            background {
              url
            }
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
export type FundList = Pick<Fund, '_id' | 'name' | 'level'>[];
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
            level
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
    '_id' | 'firstName' | 'lastName' | 'avatar'
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
          }
        }
      }
    `,
  );
}
