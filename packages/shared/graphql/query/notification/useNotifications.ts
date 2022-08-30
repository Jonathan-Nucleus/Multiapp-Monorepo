import { useRef, useState } from "react";
import { Notification } from "backend/graphql/notifications.graphql";
import {
  FetchMoreQueryOptions,
  gql,
  QueryResult,
  useQuery,
} from "@apollo/client";

export type { Notification };

type NotificationsData = {
  notifications?: Notification[];
};

type NotificationsVariables = {
  before?: string;
  limit?: number;
};

export function useNotifications(
  before?: string,
  limit = 10
): QueryResult<NotificationsData, NotificationsVariables> {
  const isFetchMore = useRef(false);
  const { data, loading, ...rest } = useQuery<
    NotificationsData,
    NotificationsVariables
  >(
    gql`
      query Notifications($before: ID, $limit: Int) {
        notifications(before: $before, limit: $limit) {
          _id
          type
          userId
          title
          body
          isNew
          isRead
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
    {
      fetchPolicy: "cache-and-network",
      variables: {
        before,
        limit,
      },
      skip: isFetchMore.current,
      notifyOnNetworkStatusChange: true,
    }
  );
  const [state, setState] = useState<NotificationsData | undefined>(data);
  const fetchMore: typeof rest.fetchMore = async (
    params: FetchMoreQueryOptions<NotificationsVariables>
  ) => {
    if (isFetchMore.current) return;
    const result = await rest.fetchMore({
      ...params,
      variables: {
        limit,
        ...params.variables,
      },
    });

    if (result.data.notifications && result.data.notifications.length > 0) {
      console.log(
        "Fetched",
        result.data.notifications.length,
        "more notifications"
      );
      const newData = { ...state };
      newData.notifications = [
        ...(newData.notifications ? newData.notifications : []),
        ...result.data.notifications,
      ];
      setState(newData);
    }
    isFetchMore.current = false;
    return result as any; // TODO: Resolve type mismatch error
  };

  return { data: state, loading, ...rest, fetchMore };
}
