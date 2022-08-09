import appsFlyer from 'react-native-appsflyer';

export const AF_CLICK_LOGIN = 'af_click_login';

const initOptions = {
  isDebug: true,
  devKey: `${process.env.AF_DEV_KEY}`,
  onInstallConversionDataListener: true,
  timeToWaitForATTUserAuthorization: 10,
  appId: `${process.env.AF_APP_ID}`,
};

// AppsFlyer initialization flow. ends with initSdk.
export async function AFInit() {
  await appsFlyer.initSdk(initOptions);
}

// Sends in-app events to AppsFlyer servers. name is the events name ('simple event') and the values are a JSON ({info: 'test', size: 5})
export async function AFLogEvent(name: string, values: object) {
  await appsFlyer.logEvent(name, values);
}
