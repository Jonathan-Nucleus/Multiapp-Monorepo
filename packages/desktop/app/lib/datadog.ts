import getConfig from "next/config";
import { datadogRum } from "@datadog/browser-rum";

//const { publicRuntimeConfig } = getConfig();

export const initializeDatadogRum = () => {
  datadogRum.init({
    applicationId: "c124c0af-824a-4f3c-a564-3226c04099a3", //publicRuntimeConfig.datadogAppId,
    clientToken: "puba017ee90348027c442bbd4739b78ccda", //publicRuntimeConfig.datadogClientToken,
    site: "datadoghq.com",
    service: "frontend",
    env: "staging", //publicRuntimeConfig.datadogRUMEnv,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  datadogRum.startSessionReplayRecording();
};
