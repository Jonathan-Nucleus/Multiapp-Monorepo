import { useEffect, useState } from "react";
import { Notification } from "backend/graphql/notifications.graphql";
import { gql, QueryResult, useQuery } from "@apollo/client";

export type { Notification };

type NotificationsData = {
  notifications: Notification[];
};

type NotificationsVariables = never;

export function useNotifications(): QueryResult<
  NotificationsData,
  NotificationsVariables
> {
  const [state, setState] = useState<NotificationsData>();
  const { data, loading, ...rest } = useQuery<
    NotificationsData,
    NotificationsVariables
  >(
    gql`
      query Notifications {
        notifications {
          _id
          type
          userId
          title
          body
          isNew
          data {
            userId
            postId
            commentId
            user {
              _id
              firstName
              lastName
              avatar
            }
          }
          user {
            _id
            firstName
            lastName
            avatar
          }
          createdAt
          updatedAt
        }
      }
    `,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
