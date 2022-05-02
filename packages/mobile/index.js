/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';

// handle background & quit state
// it is working when sending notification messages that contain an optional payload of custom key-value pairs
// https://firebase.google.com/docs/cloud-messaging/concept-options#notification-messages-with-optional-data-payload
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
