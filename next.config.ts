import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    NEXTAUTH_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
  },
  async rewrites() {
    return [
      {
        source: "/api/predict/:path*",
        destination: "http://localhost:11434/api/:path*",
      },
    ];
  },
  images: {
    domains: ['avatars.githubusercontent.com'], // For GitHub avatar images
  },
  // Add experimental features for authentication
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

export default nextConfig;
