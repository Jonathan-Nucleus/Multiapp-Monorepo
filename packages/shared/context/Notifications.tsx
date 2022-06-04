import React, { useContext, PropsWithChildren, useCallback } from "react";

import {
  useNotifications,
  Notification,
} from "shared/graphql/query/notification/useNotifications";

export type { Notification };

type NotificationsData = {
  notifications: Notification[];
  refetch: () => void;
};

const refetchUnavailable = (): void => {
  console.log("Notifications not available");
};

const NotificationsContext = React.createContext<NotificationsData>({
  notifications: [],
  refetch: refetchUnavailable,
});

export function useNotificationsContext(): NotificationsData {
  return useContext(NotificationsContext);
}

export const NotificationsProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { data, refetch } = useNotifications();
  const notifications = data?.notifications ?? [];

  console.log("Fetching notifications");

  const refetchCallback = useCallback(async (): Promise<void> => {
    console.log("Refetching notifications");
    await refetch();
  }, [refetch]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        refetch: refetchCallback,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
