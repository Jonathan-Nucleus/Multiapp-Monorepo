import { gql, QueryResult, useQuery } from '@apollo/client';
import { Notification } from 'backend/graphql/notifications.graphql';

type NotificationsData = {
  notifications: Notification[];
};

type NotificationsVariables = {};

export function useNotifications(): QueryResult<
  NotificationsData,
  NotificationsVariables
> {
  return useQuery<NotificationsData, NotificationsVariables>(
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
  );
}
