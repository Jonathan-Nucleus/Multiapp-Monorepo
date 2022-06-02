import { gql, useQuery, QueryResult } from "@apollo/client";
import { Fund as GraphQLFund } from "backend/graphql/funds.graphql";
import {
  DocumentCategories,
  DocumentCategory,
} from "backend/graphql/enumerations.graphql";

import {
  FUND_SUMMARY_FRAGMENT,
  FUND_COMPANY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundCompany,
  FundManager,
} from "shared/graphql/fragments/fund";
import { useEffect, useState } from "react";

export type { DocumentCategory };
export { DocumentCategories };

export type FundDetails = FundSummary &
  FundManager &
  FundCompany & {
    documents: GraphQLFund["documents"];
    team: Pick<
      GraphQLFund["team"][number],
      "_id" | "firstName" | "lastName" | "avatar" | "position"
    >[];
  } & Pick<
    GraphQLFund,
    | "aum"
    | "lockup"
    | "liquidity"
    | "fees"
    | "tags"
    | "attributes"
    | "metrics"
    | "videos"
    | "updatedAt"
  >;

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
  const [state, setState] = useState<FundData>();
  const { data, loading, ...rest } = useQuery<FundData, FundVariables>(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${FUND_COMPANY_FRAGMENT}
      ${FUND_MANAGER_FRAGMENT}
      query Fund($fundId: ID!) {
        fund(fundId: $fundId) {
          ...FundSummaryFields
          ...FundCompanyFields
          ...FundManagerFields
          aum
          lockup
          liquidity
          fees {
            label
            value
          }
          attributes {
            label
            value
          }
          tags
          metrics {
            date
            figure
          }
          videos
          documents {
            title
            url
            category
            date
          }
          team {
            _id
            firstName
            lastName
            avatar
            position
          }
          updatedAt
        }
      }
    `,
    {
      skip: !fundId,
      variables: { fundId: fundId ?? "" },
    }
  );
  useEffect(() => {
    if (!loading && data && data.fund) {
      const parsedDates: FundData = {
        fund: {
          ...data.fund,
          metrics: data.fund.metrics?.map((metric) => ({
            ...metric,
            date: new Date(metric.date),
          })),
          documents: data.fund.documents?.map((doc) => ({
            ...doc,
            createdAt: new Date(doc.createdAt),
            date: new Date(doc.date),
          })),
          updatedAt: new Date(data.fund.updatedAt),
        },
      };

      setState(parsedDates);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
