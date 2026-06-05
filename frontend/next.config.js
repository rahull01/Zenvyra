/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/signup", destination: "/auth/signup", permanent: true },
      { source: "/dashboard/settings", destination: "/dashboard/settings/account", permanent: false },
      { source: "/cookie-scanner", destination: "/products/cookie-scanner", permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!v1/banner/[^/]+/bundle\\.js$).*)",
        destination: `${process.env.API_BASE_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/p/:companySlug/:policyType",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
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
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
