import { authorize } from 'react-native-app-auth';
import jwt_decode from 'jwt-decode';
import { GOOGLE_ID } from 'react-native-dotenv';

const GOOGLE_CONFIG = {
  issuer: 'https://accounts.google.com',
  clientId: GOOGLE_ID,
  redirectUrl:
    'com.googleusercontent.apps.508192015943-gidqhglkkl7c8gkq1190h19gnce97sh5:/oauth2redirect/google',
  scopes: ['openid', 'profile', 'email'],
};

interface GoogleIDPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface AuthenticationResult {
  token: string;
  payload: GoogleIDPayload;
}

export const authenticate = async (): Promise<AuthenticationResult | null> => {
  const result = await authorize(GOOGLE_CONFIG);
  const { idToken } = result;

  try {
    const payload: GoogleIDPayload = jwt_decode(idToken);

    return {
      token: idToken,
      payload,
    };
  } catch (err) {
    console.log('Invalid Google id token');
  }

  return null;
};
