import getConfig from "next/config";
import { datadogRum } from "@datadog/browser-rum";

const { publicRuntimeConfig } = getConfig();

export const initializeDatadogRum = () => {
  datadogRum.init({
    applicationId: publicRuntimeConfig.datadogAppId,
    clientToken: publicRuntimeConfig.datadogClientToken,
    site: "datadoghq.com",
    service: "frontend",
    env: publicRuntimeConfig.datadogRUMEnv,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  datadogRum.startSessionReplayRecording();
};
