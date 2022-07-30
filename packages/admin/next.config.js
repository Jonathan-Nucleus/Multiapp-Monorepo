const path = require("path");
const withTM = require("next-transpile-modules")(["backend", "shared", "desktop"]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    SCHEMA_BUILD: 1, // Increment each time backend schema changes
  },
  publicRuntimeConfig: {
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
    return config;
  },
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
});

module.exports = nextConfig;
