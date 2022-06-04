import React, { FC, PropsWithChildren, useEffect } from 'react';
import { NotificationsProvider } from 'shared/context/Notifications';

import { navigate } from 'mobile/src/services/navigation/NavigationService';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { showMessage } from 'mobile/src/services/utils';
import { useNotificationsContext } from 'shared/context/Notifications';

const NotificationsManager: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { refetch } = useNotificationsContext();

  const handleMessage = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): void => {
    const { category, data } = remoteMessage;
    if (category === 'stream.chat' && data) {
      const cid = data.cid;
      navigate('Main', {
        screen: 'Chat',
        params: {
          screen: 'Channel',
          params: {
            channelId: cid,
          },
        },
      });
    } else if (data) {
      if (data.postId) {
        navigate('PostDetails', {
          screen: 'PostDetail',
          params: {
            postId: data.postId,
          },
        });
      }
    }
  };

  useEffect(() => {
    // handle interaction from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      handleMessage(remoteMessage);
    });

    // handle interaction from quit state
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          handleMessage(remoteMessage);
        }
      });

    // handle foreground state
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // refetch notification logic
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      showMessage(
        'info',
        remoteMessage.notification?.title || '',
        remoteMessage.notification?.body,
      );

      refetch();
    });
    return unsubscribe;
  }, [refetch]);

  return <>{children}</>;
};

export default NotificationsManager;
