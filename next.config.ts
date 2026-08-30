import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/weather-app',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
