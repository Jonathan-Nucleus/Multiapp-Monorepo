import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestUserNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log(enabled, 'Authorization status:', authStatus);

  if (enabled) {
    // User has authorised
    const pushToken = await getToken();
    await AsyncStorage.setItem('@fcm_token', pushToken);
  } else {
    // User has rejected permissions
  }
};

const getToken = async () => {
  const fcmToken = await firebase.messaging().getToken();
  console.log('fcm token:::', fcmToken);
  return fcmToken;
};
