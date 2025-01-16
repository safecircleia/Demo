import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:11434/api/:path*",
      },
    ];
  },
};
module.exports = nextConfig;

export default nextConfig;
