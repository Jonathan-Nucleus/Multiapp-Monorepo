import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import { GAEventAction, GAEventParams } from 'shared/src/ga';

export const setAnalyticsEnabled = async (enabled: boolean): Promise<void> => {
  await analytics().setAnalyticsCollectionEnabled(enabled);
};

export const logScreenView = async (
  screen_name: string,
  screen_class: string,
): Promise<void> => {
  await analytics().logScreenView({
    screen_name,
    screen_class,
  });
};

export const logEvent = async (
  action: GAEventAction,
  params?: GAEventParams,
): Promise<void> => {
  try {
    await analytics().logEvent(action, { ...params, platform: Platform.OS });
  } catch (_error) {}
};
