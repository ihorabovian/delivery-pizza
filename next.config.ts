import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "juniorsbootcamp.ru",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
