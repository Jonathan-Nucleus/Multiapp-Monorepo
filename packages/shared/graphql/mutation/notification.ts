import { gql, MutationTuple, useMutation } from "@apollo/client";

type ReadNotificationData = {
  readNotification: boolean;
};

type ReadNotificationVariables = {
  notificationId?: string;
};

export function useReadNotification(): MutationTuple<
  ReadNotificationData,
  ReadNotificationVariables
> {
  return useMutation<ReadNotificationData, ReadNotificationVariables>(
    gql`
      mutation ReadNotification($notificationId: ID!) {
        readNotification(notificationId: $notificationId)
      }
    `,
    {
      refetchQueries: ["Notifications"],
    }
  );
}

type ReadNotificationsData = {
  readNotification: boolean;
};

type ReadNotificationsVariables = never;

export function useReadNotifications(): MutationTuple<
  ReadNotificationsData,
  ReadNotificationsVariables
> {
  return useMutation<ReadNotificationsData, ReadNotificationsVariables>(
    gql`
      mutation ReadAllNotifications {
        readNotification
      }
    `,
    {
      refetchQueries: ["Notifications"],
    }
  );
}
