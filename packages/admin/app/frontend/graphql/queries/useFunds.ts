import { QueryResult, useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { FundDetails, FUND_FRAGMENT } from "../fragments/funds";

type UsersVariables = never;

export type UserFunds = FundDetails;
export type UserFundsData = {
  users?: UserFunds[];
};

export function useFunds(): QueryResult<UserFundsData, UsersVariables> {
  const [state, setState] = useState<UserFundsData>();
  const { data, loading, ...rest } = useQuery<UserFundsData, UsersVariables>(
    gql`
      ${FUND_FRAGMENT}
      query Users {
        users {
          ...UserFundsFields
        }
      }
    `
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
