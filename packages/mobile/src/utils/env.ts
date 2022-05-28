import AsyncStorage from '@react-native-async-storage/async-storage';
import { S3_BUCKET_DEV, S3_BUCKET_STAGING } from 'react-native-dotenv';

const ENV = 'env';
type Env = 'dev' | 'staging';

let currentEnv: Env = 'dev';
(async () => {
  currentEnv = ((await AsyncStorage.getItem(ENV)) as Env) ?? 'dev';
})();

export function getEnv(): Env {
  return currentEnv;
}

export async function setEnv(env: Env): Promise<void> {
  await AsyncStorage.setItem(ENV, env);
  currentEnv = env;
}

export const avatarUrl = (): string => {
  return `${getEnv() === 'staging' ? S3_BUCKET_STAGING : S3_BUCKET_DEV}avatars`;
};

export const backgroundUrl = (): string => {
  return `${
    getEnv() === 'staging' ? S3_BUCKET_STAGING : S3_BUCKET_DEV
  }backgrounds`;
};

export const postsUrl = (): string => {
  return `${getEnv() === 'staging' ? S3_BUCKET_STAGING : S3_BUCKET_DEV}posts`;
};

export const fundsUrl = (): string => {
  return `${getEnv() === 'staging' ? S3_BUCKET_STAGING : S3_BUCKET_DEV}funds`;
};
