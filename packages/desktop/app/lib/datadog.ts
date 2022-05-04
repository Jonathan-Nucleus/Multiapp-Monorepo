import { datadogRum } from '@datadog/browser-rum';

export const initializeDatadogRum = ()=>{
  datadogRum.init({
    applicationId: process.env.DATADOG_RUM_APPLICATION_ID!,
    clientToken: process.env.DATADOG_RUM_CLIENT_TOKEN!,
    site: 'datadoghq.com',
    service: 'frontend',
    env: process.env.DATADOG_RUM_ENVIRONMENT!,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input'
  });

  datadogRum.startSessionReplayRecording();
}
