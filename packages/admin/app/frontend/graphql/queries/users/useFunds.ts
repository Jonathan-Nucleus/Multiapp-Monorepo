import { QueryResult, useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { FUND_FRAGMENT, FundDetails } from "../../fragments/funds";

type UserFundsVariables = {
  userId: string;
};

export type UserFundsData = {
  user?: {
    watchlist: FundDetails[];
    managedFunds?: FundDetails[];
  };
};

export function useFunds(
  userId: string
): QueryResult<UserFundsData, UserFundsVariables> {
  const [state, setState] = useState<UserFundsData>();
  const { data, loading, ...rest } = useQuery<
    UserFundsData,
    UserFundsVariables
  >(
    gql`
      ${FUND_FRAGMENT}
      query User($userId: ID!) {
        user(userId: $userId) {
          watchlist {
            ...FundFields
          }
          managedFunds {
            ...FundFields
          }
        }
      }
    `,
    {
      notifyOnNetworkStatusChange: true,
      variables: { userId },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
