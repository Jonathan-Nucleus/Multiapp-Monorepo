import firebaseAdmin from "firebase-admin";

import "dotenv/config";

let firebaseInitialized = false;

export const initializeFirebase = (): void => {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("Missing credential file.");
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (!serviceAccount) {
      throw new Error("Invalid credential file.");
    }

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log("✅ Firebase initialized succeeded!");
  } catch (err) {
    console.log("❌ Firebase initialized failed...");
  }
};

export const sendPushNotification = async (
  title: string,
  body: string,
  token: string
): Promise<void> => {
  if (!firebaseInitialized || !token) {
    return;
  }

  try {
    await firebaseAdmin.messaging().send({
      notification: {
        title,
        body,
      },
      token,
    });
  } catch (err) {
    console.error(err);
  }
};
