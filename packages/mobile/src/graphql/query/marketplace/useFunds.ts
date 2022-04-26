import { gql, useQuery, QueryResult } from '@apollo/client';
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_COMPANY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundCompany,
  FundManager,
} from 'mobile/src/graphql/fragments/fund';

type FundsVariables = never;

export type Fund = FundSummary & FundCompany & FundManager;
export type FundsData = {
  funds?: Fund[];
};

/**
 * GraphQL query that fetches funds for the current user. These are
 * automatically filtered by the user's accreditation status.
 *
 * @returns   GraphQL query.
 */
export function useFunds(): QueryResult<FundsData, FundsVariables> {
  return useQuery<FundsData, FundsVariables>(gql`
    ${FUND_SUMMARY_FRAGMENT}
    ${FUND_COMPANY_FRAGMENT}
    ${FUND_MANAGER_FRAGMENT}
    query Funds {
      funds {
        ...FundSummaryFields
        ...FundCompanyFields
        ...FundManagerFields
      }
    }
  `);
}
