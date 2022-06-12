import { gql, useLazyQuery, QueryTuple } from "@apollo/client";
import { useEffect, useState } from "react";
import { LinkPreview } from "backend/graphql/queries.graphql";

export type { LinkPreview };
type LinkPreviewVariables = {
  body: string;
};
export type LinkPreviewData = {
  linkPreview: LinkPreview;
};

/**
 * GraphQL query that fetches an access token for messaging.
 *
 * @returns   GraphQL query.
 */
export function useLinkPreview(): QueryTuple<
  LinkPreviewData,
  LinkPreviewVariables
> {
  return useLazyQuery<LinkPreviewData, LinkPreviewVariables>(
    gql`
      query LinkPreview($body: String!) {
        linkPreview(body: $body) {
          url
          mediaType
          contentType
          favicons
          title
          siteName
          description
          images
          favicons
        }
      }
    `
  );
}
