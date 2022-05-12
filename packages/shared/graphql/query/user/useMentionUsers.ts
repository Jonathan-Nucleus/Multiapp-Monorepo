import { useEffect, useState } from "react";
import { gql, useQuery, QueryResult } from "@apollo/client";
import {
  USER_SUMMARY_FRAGMENT,
  UserSummary,
} from "shared/graphql/fragments/user";

type MentionUsersVariables = {
  search?: string;
};

export type User = UserSummary;
export type MentionUsersData = {
  mentionUsers?: User[];
};

/**
 * GraphQL query that performs a lazy query for mention users based on search
 * text.
 *
 * @returns   GraphQL query.
 */
export function useMentionUsers(): QueryResult<
  MentionUsersData,
  MentionUsersVariables
> {
  const [state, setState] = useState<MentionUsersData>();
  const { data, loading, ...rest } = useQuery<
    MentionUsersData,
    MentionUsersVariables
  >(
    gql`
      ${USER_SUMMARY_FRAGMENT}
      query MentionUsers($search: String) {
        mentionUsers(search: $search) {
          ...UserSummaryFields
        }
      }
    `
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);

  return { data: state, loading, ...rest };
}
