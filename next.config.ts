import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdf2json"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;
