import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_KEY = 'fcm_token';

interface FCMToken {
  token: string;
  updatedAt: Date;
}

/**
 * Fetches a Firebase Cloud Messaging (FCM) token for push notifications.
 */
const getToken = async () => {
  const fcmToken = await firebase.messaging().getToken();
  console.log('Retreived FCM token', fcmToken);
  return fcmToken;
};

/**
 * Starts the Push Notification service, ensuring that the appropriate user
 * permissions have been requested and fetching an FCM token if granted. The
 * FCM token is stored locally once received and any observers are notified
 * on this event.
 */
export const start = async (): Promise<void> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('FCM authorization enabled:', enabled, 'with status', authStatus);

  if (enabled) {
    const pushToken = await getToken();
    const storedValue = JSON.stringify({
      token: pushToken,
      updatedAt: new Date().toJSON(),
    });
    await AsyncStorage.setItem(FCM_KEY, storedValue);
    notify();
  }
};

export async function readToken(): Promise<FCMToken | undefined> {
  const storedValue = await AsyncStorage.getItem(FCM_KEY);
  if (storedValue) {
    const jsonObject = JSON.parse(storedValue);
    return {
      token: jsonObject.token,
      updatedAt: new Date(jsonObject.updatedAt),
    };
  }

  return undefined;
}

let observers: (() => void)[] = [];

export function attachTokenObserver(observer: () => void): void {
  observers.push(observer);
}

export function detachTokenObserver(observer: () => void): void {
  observers = observers.filter((ob) => ob !== observer);
}

function notify(): void {
  observers.forEach((observer) => observer());
}
