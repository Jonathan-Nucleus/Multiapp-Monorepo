import { gql, useQuery, QueryResult } from '@apollo/client';
import {
  USER_SUMMARY_FRAGMENT,
  UserSummary,
} from 'mobile/src/graphql/fragments/user';

type UsersVariables = never;

export type User = UserSummary;
export type UsersData = {
  users?: User[];
};

/**
 * GraphQL query that fetches the user profile data for all users.
 *
 * @returns   GraphQL query.
 */
export function useUsers(): QueryResult<UsersData, UsersVariables> {
  return useQuery<UsersData, UsersVariables>(
    gql`
      ${USER_SUMMARY_FRAGMENT}
      query Users {
        users {
          ...UserSummaryFields
        }
      }
    `,
  );
}
