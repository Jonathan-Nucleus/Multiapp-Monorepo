import { gql, useQuery, QueryResult } from '@apollo/client';
import _ from 'lodash';
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

export const useUsersStated = () => {
  const { data, loading } = useUsers();
  const [state, setState] = useState<User[]>();
  useEffect(() => {
    if (!loading && data?.users && !_.isEqual(data.users, state)) {
      setState(data.users);
    }
  }, [data, loading]);
  return state;
};
