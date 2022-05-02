import { LINKEDIN_ID, LINKEDIN_SECRET } from 'react-native-dotenv';

export const providerConfig = {
  linkedin: {
    clientId: LINKEDIN_ID,
    clientSecret: LINKEDIN_SECRET,
    redirectUrl: 'com.prometheaus:/oauth2redirect/linked',
    scopes: ['r_emailaddress', 'r_liteprofile'],
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    },
  },
};
