import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@google/antigravity", "@antigravity/shared", "@antigravity/ai-agents"],
  webpack: (config, { isServer }) => {
    // Ensure yjs and y-websocket are resolved from node_modules
    if (config.resolve) {
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "../..", "node_modules"),
      ];
    }

    // Client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
