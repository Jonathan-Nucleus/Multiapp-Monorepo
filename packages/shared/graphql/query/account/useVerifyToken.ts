import { gql, useLazyQuery, QueryTuple } from "@apollo/client";

type VerifyTokenVariables = {
  token: string;
};

export type VerifyTokenData = {
  verifyToken: boolean;
};

/**
 * GraphQL query that verifies an access token for the app.
 *
 * @returns   GraphQL query.
 */
export function useVerifyToken(): QueryTuple<
  VerifyTokenData,
  VerifyTokenVariables
> {
  return useLazyQuery<VerifyTokenData, VerifyTokenVariables>(
    gql`
      query VerifyToken($token: String!) {
        verifyToken(token: $token)
      }
    `,
    { fetchPolicy: "network-only" }
  );
}
