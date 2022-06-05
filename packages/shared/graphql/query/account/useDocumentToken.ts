import { gql, useLazyQuery, QueryTuple } from "@apollo/client";

type DocumentTokenVariables = {
  fundId: string;
  document: string;
};
export type DocumentTokenData = {
  documentToken?: string;
};

/**
 * GraphQL query that fetches an access token for fund documents.
 *
 * @returns   GraphQL query.
 */
export function useDocumentToken(): QueryTuple<
  DocumentTokenData,
  DocumentTokenVariables
> {
  return useLazyQuery<DocumentTokenData, DocumentTokenVariables>(
    gql`
      query DocumentToken($fundId: ID!, $document: String!) {
        documentToken(fundId: $fundId, document: $document)
      }
    `,
    { fetchPolicy: "network-only" }
  );
}
