import { useEffect, useState } from 'react';
import { useNotifications } from './index';
import { Notification } from 'backend/graphql/notifications.graphql';

export const useNotificationsStated = () => {
  const { data, loading } = useNotifications();
  const [state, setState] = useState<Notification[]>();
  useEffect(() => {
    if (!loading && data?.notifications) {
      setState(data.notifications);
    }
  }, [data, loading]);
  return state;
};
