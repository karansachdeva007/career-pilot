import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdf2json", "@xenova/transformers"],
  outputFileTracingExcludes: {
    "**/*": ["**/node_modules/onnxruntime-node/**/*"],
  },
};

export default nextConfig;
