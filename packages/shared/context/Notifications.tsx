import React, { useContext, PropsWithChildren, useCallback } from "react";

import {
  useNotifications,
  Notification,
} from "shared/graphql/query/notification/useNotifications";

export type { Notification };

type NotificationsData = {
  notifications: Notification[];
  refetch: () => void;
  fetchMore: any;
  loading: boolean;
};

const refetchUnavailable = (): void => {
  console.log("Notifications not available");
};
const fetchMoreUnavailable = (): void => {
  console.log("Notifications not available");
};

const NotificationsContext = React.createContext<NotificationsData>({
  notifications: [],
  refetch: refetchUnavailable,
  fetchMore: fetchMoreUnavailable,
  loading: false,
});

export function useNotificationsContext(): NotificationsData {
  return useContext(NotificationsContext);
}

export const NotificationsProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { data, refetch, fetchMore, loading } = useNotifications();
  const notifications = data?.notifications ?? [];

  const refetchCallback = useCallback(async (): Promise<void> => {
    console.log("Refetching notifications");
    await refetch();
  }, [refetch]);

  const fetchmoreCallback = useCallback(
    async (before): Promise<void> => {
      await fetchMore(before);
    },
    [fetchMore]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        refetch: refetchCallback,
        fetchMore: fetchmoreCallback,
        loading: loading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
