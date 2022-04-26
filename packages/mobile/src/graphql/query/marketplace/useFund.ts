import { gql, useQuery, QueryResult } from '@apollo/client';
import { Fund as GraphQLFund } from 'backend/graphql/funds.graphql';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_COMPANY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundCompany,
  FundManager,
} from 'mobile/src/graphql/fragments/fund';

export type FundDetails = FundSummary &
  FundManager &
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

type FundVariables = {
  fundId: string;
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
      ${FUND_MANAGER_FRAGMENT}
      query Fund($fundId: ID!) {
        fund(fundId: $fundId) {
          ...FundSummaryFields
          ...FundCompanyFields
          ...FundManagerFields
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
