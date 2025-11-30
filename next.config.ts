import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "coutellerie-passion.up.railway.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.coutellerie-passion.fr",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
