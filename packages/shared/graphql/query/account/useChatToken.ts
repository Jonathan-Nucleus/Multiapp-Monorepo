import { gql, useQuery, QueryResult } from "@apollo/client";
import { useEffect, useState } from "react";

type ChatTokenVariables = never;
export type ChatTokenData = {
  chatToken?: string;
};

/**
 * GraphQL query that fetches an access token for messaging.
 *
 * @returns   GraphQL query.
 */
export function useChatToken(): QueryResult<ChatTokenData, ChatTokenVariables> {
  const [state, setState] = useState<ChatTokenData>();
  const { data, loading, ...rest } = useQuery<ChatTokenData, ChatTokenVariables>(
    gql`
      query ChatToken {
        chatToken
      }
    `,
    { fetchPolicy: "network-only" },
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
