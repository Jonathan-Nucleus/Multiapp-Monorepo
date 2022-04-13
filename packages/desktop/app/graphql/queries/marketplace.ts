import { gql, useQuery, QueryResult } from "@apollo/client";
import { Fund } from "backend/graphql/funds.graphql";

type FetchFundsVariables = never;

export type FetchFundsData = {
  funds?: (Pick<
    Fund,
    "_id" | "name" | "level" | "status" | "overview" | "tags" | "background"
  > & {
    manager: Pick<
      Fund["manager"],
      "_id" | "firstName" | "lastName" | "avatar" | "followerIds" | "postIds"
    >;
    company: Pick<Fund["company"], "_id" | "name">;
  })[];
};

/**
 * GraphQL query that fetches funds for the current user. These are
 * automatically filtered by the user's accreditation status.
 *
 * @returns   GraphQL query.
 */
export function useFetchFunds(): QueryResult<
  FetchFundsData,
  FetchFundsVariables
> {
  return useQuery<FetchFundsData, FetchFundsVariables>(gql`
    query Funds {
      funds {
        _id
        name
        level
        status
        overview
        tags
        background {
          url
          x
          y
          width
          height
          scale
        }
        manager {
          _id
          firstName
          lastName
          avatar
          followerIds
          postIds
        }
        company {
          _id
          name
        }
      }
    }
  `);
}
