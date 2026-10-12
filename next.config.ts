import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The API's CORS allows only GET/HEAD/POST, so the browser blocks PATCH and
  // DELETE; same-origin requests through this proxy skip CORS entirely
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
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
