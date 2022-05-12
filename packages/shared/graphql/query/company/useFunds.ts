import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { Company } from 'backend/graphql/companies.graphql';
import {
  FUND_SUMMARY_FRAGMENT,
  FundSummary,
} from 'shared/graphql/fragments/fund';

type CompanyFundsVariables = {
  companyId: string;
};

type Fund = FundSummary;
export type CompanyFundsData = {
  companyProfile?: Pick<Company, '_id'> & {
    funds: Fund[];
  };
};

/**
 * GraphQL query that fetches funds for the specified company.
 *
 * @param companyId   The ID of the company.
 *
 * @returns   GraphQL query.
 */
export function useFunds(
  companyId: string,
): QueryResult<CompanyFundsData, CompanyFundsVariables> {
  return useQuery<CompanyFundsData, CompanyFundsVariables>(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      query CompanyFunds($companyId: ID!) {
        companyProfile(companyId: $companyId) {
          _id
          funds {
            ...FundSummaryFields
          }
        }
      }
    `,
    {
      variables: { companyId },
    },
  );
}
