import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
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
