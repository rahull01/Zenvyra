/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws",
    NEXT_PUBLIC_DODO_CLIENT_ID: process.env.NEXT_PUBLIC_DODO_CLIENT_ID,
    NEXT_PUBLIC_DODO_ENV: process.env.NEXT_PUBLIC_DODO_ENV || "sandbox",
  },
};

module.exports = nextConfig;
