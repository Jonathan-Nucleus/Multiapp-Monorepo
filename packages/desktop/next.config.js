/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SCHEMA_BUILD: 1, // Increment each time backend schema changes
  },
};

module.exports = nextConfig;
