import { QueryResult, useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { UserActivity, USER_ACTIVITY_FRAGMENT } from "../../fragments/user";

type UserActivityVariables = {
  userId: string;
};

export type UserActivityData = {
  user?: UserActivity;
};

export function useUserActivity(
  userId: string
): QueryResult<UserActivityData, UserActivityVariables> {
  const [state, setState] = useState<UserActivityData>();
  const { data, loading, ...rest } = useQuery<
    UserActivityData,
    UserActivityVariables
  >(
    gql`
      ${USER_ACTIVITY_FRAGMENT}
      query User($userId: ID!) {
        user(userId: $userId) {
          ...UserActivityDataFields
        }
      }
    `,
    {
      notifyOnNetworkStatusChange: true,
      variables: { userId },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
