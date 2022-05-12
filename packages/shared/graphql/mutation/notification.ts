import { gql, MutationTuple, useMutation } from '@apollo/client';

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
      refetchQueries: ['Notifications'],
    },
  );
}

export function useReadNotifications() {
  return useMutation(
    gql`
      mutation ReadAllNotifications {
        readNotification
      }
    `,
    {
      refetchQueries: ['Notifications'],
    },
  );
}
