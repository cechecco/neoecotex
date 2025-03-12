import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
    // nodeMiddleware: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'cloud.appwrite.io',
      },
    ],
  },
};

export default nextConfig;
