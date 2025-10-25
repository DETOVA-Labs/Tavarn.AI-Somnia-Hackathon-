import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: './',
  },
  images: {
    unoptimized: true,
  },
    experimental: {
        optimizeCss: false,
    },
};

export default nextConfig;
