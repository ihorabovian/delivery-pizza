import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local backend (127.0.0.1) images are blocked by default since Next 16
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "juniorsbootcamp.ru",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
