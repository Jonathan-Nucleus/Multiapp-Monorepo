const path = require("path");
const withTM = require("next-transpile-modules")([
  "backend",
  "mobile",
  "shared",
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    SCHEMA_BUILD: 1, // Increment each time backend schema changes
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
