import { gql, useLazyQuery, QueryTuple } from "@apollo/client";
import { USER_SUMMARY_FRAGMENT, UserSummary } from "../../fragments/user";

type SearchUsersVariables = {
  search: string;
};

export type SearchUsersData = {
  searchUsers?: UserSummary[];
};

export function useSearchUsers(): QueryTuple<
  SearchUsersData,
  SearchUsersVariables
> {
  return useLazyQuery<SearchUsersData, SearchUsersVariables>(
    gql`
      ${USER_SUMMARY_FRAGMENT}
      query SearcUsers($search: String!) {
        searchUsers(search: $search) {
          ...UserSummaryFields
        }
      }
    `,
    { notifyOnNetworkStatusChange: true }
  );
}
