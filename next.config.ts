import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://baker-glen-layer-enemies.trycloudflare.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
