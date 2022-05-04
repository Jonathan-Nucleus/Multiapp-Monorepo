import { gql, useQuery, QueryResult } from '@apollo/client';

type ChatTokenVariables = never;
export type ChatTokenData = {
  chatToken?: string;
};

/**
 * GraphQL query that fetchs an access token for messaging.
 *
 * @returns   GraphQL query.
 */
export function useChatToken(): QueryResult<ChatTokenData, ChatTokenVariables> {
  return useQuery<ChatTokenData, ChatTokenVariables>(
    gql`
      query ChatToken {
        chatToken
      }
    `,
  );
}
