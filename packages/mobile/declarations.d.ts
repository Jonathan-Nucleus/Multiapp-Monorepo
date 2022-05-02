interface ObjectConstructor {
  keys<T>(o: T): (keyof T)[];
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png';

declare module '@env';

declare module 'react-native-dotenv' {
  declare const POST_URL: string;
  declare const AVATAR_URL: string;
  declare const BACKGROUND_URL: string;
  declare const GRAPHQL_URI: string;
  declare const GOOGLE_ID: string;
  declare const LINKEDIN_ID: string;
  declare const LINKEDIN_SECRET: string;
}
