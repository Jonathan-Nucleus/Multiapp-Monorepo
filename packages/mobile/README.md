# Prometheus React Native App

React Native front-end application for Prometheus.

## Setting up the development environment

Create a `.env` file in the mobile application directory and populate it with
the following variables:

```
ENV=dev
GRAPHQL_URI=https://api-dev2.prometheusalts.com
WATRMARKING_SERVICE_URL=https://api-dev2.prometheusalts.com/pdf-watermark
S3_BUCKET=https://media-dev2.prometheusalts.com
GETSTREAM_ACCESS_KEY=p2n5abqg47rf

DD_APP_ID={datadog app id}
DD_TOKEN={datadog token}
AF_DEV_KEY={AppsFlyer devKey}
AF_APP_ID={AppsFlyer app id}

```

## Building for iOS

To build and run the application for iOS, complete the following steps:

1. Make sure all package dependencies are installed by running `yarn install`
   at the project root, followed by `yarn bootstrap`.
2. Navigate to `ignite/packages/mobile/ios` and run `pod install`.
3. Navigate to `ignite/packages/mobile` and run `yarn run ios`.
