import { gql, useQuery, QueryResult } from '@apollo/client';
import { Fund as GraphQLFund } from 'backend/graphql/funds.graphql';

type FetchFundsVariables = never;

export type Fund = Pick<
  GraphQLFund,
  '_id' | 'name' | 'level' | 'status' | 'overview' | 'tags' | 'background'
> & {
  manager: Pick<
    GraphQLFund['manager'],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'followerIds' | 'postIds'
  >;
  company: Pick<GraphQLFund['company'], '_id' | 'name'>;
};

export type FetchFundsData = {
  funds?: Fund[];
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
