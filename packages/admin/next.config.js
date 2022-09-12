const path = require("path");
const withTM = require("next-transpile-modules")([
  "backend",
  "shared",
  "desktop",
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  publicRuntimeConfig: {
    NEXT_PUBLIC_AWS_BUCKET: process.env.NEXT_PUBLIC_AWS_BUCKET,
    NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
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
  images: {
    domains: [`${process.env.NEXT_PUBLIC_AWS_BUCKET}`.replace("https://", "")],
  },
});

module.exports = nextConfig;
