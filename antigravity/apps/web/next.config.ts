import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    },
    turbo: true
  },
  reactStrictMode: true,
  poweredByHeader: false,
  srcDir: "src"
};

export default nextConfig;
