import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "trycloudflare.com",
    "alcohol-elderly-hull-activists.trycloudflare.com",
  ],
};

export default nextConfig;
