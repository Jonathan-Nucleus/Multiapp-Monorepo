import { gql, useQuery, QueryResult } from "@apollo/client";
import { USER_SUMMARY_FRAGMENT, UserSummary } from "../../fragments/user";
import { useEffect, useState } from "react";

type UsersVariables = {
  after?: string;
  limit?: number;
};

export type { UserSummary };
export type UsersData = {
  users?: UserSummary[];
};

export function useUsers(): QueryResult<UsersData, UsersVariables> {
  const [state, setState] = useState<UsersData>();
  const { data, loading, ...rest } = useQuery<UsersData, UsersVariables>(
    gql`
      ${USER_SUMMARY_FRAGMENT}
      query Users($after: ID, $limit: Int) {
        users(after: $after, limit: $limit) {
          ...UserSummaryFields
        }
      }
    `,
    { fetchPolicy: "cache-and-network", notifyOnNetworkStatusChange: true }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
