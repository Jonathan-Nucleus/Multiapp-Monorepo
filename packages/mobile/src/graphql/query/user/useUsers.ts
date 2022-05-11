import { gql, useQuery, QueryResult } from '@apollo/client';
import {
  USER_SUMMARY_FRAGMENT,
  UserSummary,
} from 'mobile/src/graphql/fragments/user';
import { useEffect, useState } from 'react';

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
  const [state, setState] = useState<UsersData>();
  const { data, loading, ...rest } = useQuery<UsersData, UsersVariables>(
    gql`
      ${USER_SUMMARY_FRAGMENT}
      query Users {
        users {
          ...UserSummaryFields
        }
      }
    `,
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
