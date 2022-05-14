import { gql, QueryResult, useQuery } from "@apollo/client";
import { User } from "backend/graphql/users.graphql";
import {
  FUND_SUMMARY_FRAGMENT,
  FUND_COMPANY_FRAGMENT,
  FUND_MANAGER_FRAGMENT,
  FundSummary,
  FundCompany,
  FundManager,
} from "shared/graphql/fragments/fund";
import { useEffect, useState } from "react";

export type ManagedFund = FundSummary & FundCompany & FundManager;
export type UserManagedFundsData = {
  userProfile?: Pick<User, "_id"> & {
    managedFunds: ManagedFund[];
  };
};

type UserManagedFundsVariables = {
  userId: string;
};

export function useManagedFunds(
  userId: string
): QueryResult<UserManagedFundsData, UserManagedFundsVariables> {
  const [state, setState] = useState<UserManagedFundsData>();
  const { data, loading, ...rest } = useQuery<
    UserManagedFundsData,
    UserManagedFundsVariables
  >(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${FUND_COMPANY_FRAGMENT}
      ${FUND_MANAGER_FRAGMENT}
      query UserManagedFunds($userId: ID!) {
        userProfile(userId: $userId) {
          _id
          managedFunds {
            ...FundSummaryFields
            ...FundCompanyFields
            ...FundManagerFields
          }
        }
      }
    `,
    { variables: { userId } }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
