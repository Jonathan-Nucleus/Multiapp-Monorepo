import getConfig from "next/config";
import { datadogRum } from "@datadog/browser-rum";

const { publicRuntimeConfig } = getConfig();
const {
  DATADOG_RUM_APPLICATION_ID,
  DATADOG_RUM_CLIENT_TOKEN,
  DATADOG_RUM_ENVIRONMENT,
} = publicRuntimeConfig;

export const initializeDatadogRum = () => {
  datadogRum.init({
    applicationId: DATADOG_RUM_APPLICATION_ID,
    clientToken: DATADOG_RUM_CLIENT_TOKEN,
    site: "datadoghq.com",
    service: "frontend",
    env: DATADOG_RUM_ENVIRONMENT,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  datadogRum.startSessionReplayRecording();
};
