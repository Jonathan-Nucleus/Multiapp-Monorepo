import { gql, useQuery, QueryResult } from "@apollo/client";
import { Company } from "backend/graphql/companies.graphql";
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundManager,
} from "shared/graphql/fragments/fund";
import { useEffect, useState } from "react";

type CompanyFundsVariables = {
  companyId: string;
};

type Fund = FundSummary & FundManager;
export type CompanyFundsData = {
  companyProfile?: Pick<Company, "_id"> & {
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
  companyId: string
): QueryResult<CompanyFundsData, CompanyFundsVariables> {
  const [state, setState] = useState<CompanyFundsData>();
  const { data, loading, ...rest } = useQuery<
    CompanyFundsData,
    CompanyFundsVariables
  >(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${FUND_MANAGER_FRAGMENT}
      query CompanyFunds($companyId: ID!) {
        companyProfile(companyId: $companyId) {
          _id
          funds {
            ...FundSummaryFields
            ...FundManagerFields
          }
        }
      }
    `,
    {
      variables: { companyId },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
