import { useEffect, useRef, useState } from "react";
import { Notification } from "backend/graphql/notifications.graphql";
import {
  FetchMoreQueryOptions,
  gql,
  NetworkStatus,
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
  const didUpdateState = useRef(false);
  const { data, loading, networkStatus, ...rest } = useQuery<
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
      skip: isFetchMore.current || didUpdateState.current,
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
      didUpdateState.current = true;
    }
    isFetchMore.current = false;
    return result as any; // TODO: Resolve type mismatch error
  };

  // Reset flag once a single rerender after a state update has been initiated
  if (didUpdateState.current) {
    didUpdateState.current = false;
  }

  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      const newItems = data?.notifications || [];
      const existingItems = [...(state?.notifications ?? [])];

      const newIds = newItems.map((item) => item._id);
      const oldIds = existingItems.map((item) => item._id);

      // Replace overlapping items with new data.
      const intersection = newIds.filter((id) => oldIds.includes(id));
      if (intersection.length > 0) {
        const firstIndex = oldIds.indexOf(intersection[0]);
        const lastIndex = oldIds.indexOf(intersection[intersection.length - 1]);
        existingItems.splice(
          firstIndex,
          lastIndex - firstIndex + 1,
          ...newItems
        );
      } else {
        existingItems.splice(0, 0, ...newItems);
      }

      setState({ notifications: existingItems });
      didUpdateState.current = true;
    }
  }, [data, networkStatus]);

  return { data: state, loading, ...rest, fetchMore, networkStatus };
}
