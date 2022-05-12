import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/react-hooks';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import AppNavigator from './navigations/AppNavigator';
import { useInitializeClient } from './services/apolloClient';
import { requestUserNotificationPermission } from './services/PushNotificationService';
import { showMessage } from './services/utils';

// Used only for demos. Comment out when not demoing.
console.disableYellowBox = true;

const App = () => {
  useEffect(() => {
    requestUserNotificationPermission();

    // handle interaction from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // handle interaction from quit state
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
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
    });
    return unsubscribe;
  }, []);

  const client = useInitializeClient();
  if (!client) {
    return null;
  }

  StatusBar.setBarStyle('light-content');

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;
