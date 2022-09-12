import { gql, useLazyQuery, QueryTuple } from "@apollo/client";
import {
  USER_DETAILS_FRAGMENT,
  User as UserEntity,
} from "../../fragments/user";
import { FundDetails, FUND_FRAGMENT } from "../../fragments/funds";

export type User = UserEntity & {
  watchlist: FundDetails[];
};

type UserVariables = {
  userId: string;
};

export type UserData = {
  user?: User;
};

export function useUser(): QueryTuple<UserData, UserVariables> {
  return useLazyQuery<UserData, UserVariables>(
    gql`
      ${USER_DETAILS_FRAGMENT}
      ${FUND_FRAGMENT}
      query User($userId: ID!) {
        user(userId: $userId) {
          ...UserDetailsFields
          watchlist {
            ...FundFields
          }
        }
      }
    `,
    { fetchPolicy: "cache-and-network" }
  );
}
