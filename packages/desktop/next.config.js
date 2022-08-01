const path = require("path");
const withTM = require("next-transpile-modules")(["backend", "shared"]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    SCHEMA_BUILD: 1, // Increment each time backend schema changes
  },
  publicRuntimeConfig: {
    DATADOG_RUM_APPLICATION_ID: process.env.DATADOG_RUM_APPLICATION_ID,
    DATADOG_RUM_CLIENT_TOKEN: process.env.DATADOG_RUM_CLIENT_TOKEN,
    DATADOG_RUM_ENVIRONMENT: process.env.DATADOG_RUM_ENVIRONMENT,
    NEXT_PUBLIC_AWS_BUCKET: process.env.NEXT_PUBLIC_AWS_BUCKET,
    NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    NEXT_PUBLIC_GETSTREAM_ACCESS_KEY:
      process.env.NEXT_PUBLIC_GETSTREAM_ACCESS_KEY,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.join(__dirname, "node_modules", "react"),
    };
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]});
    return config;
  },
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
});

module.exports = nextConfig;
