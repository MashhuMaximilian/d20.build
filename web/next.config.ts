import type { NextConfig } from "next";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs$: require.resolve("yjs"),
    };

    return config;
  },
};

export default nextConfig;
