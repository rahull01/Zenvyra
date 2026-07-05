/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const isProductionRuntime =
  process.env.VERCEL_ENV === "production" || process.env.Zenvyra_REQUIRE_PROD_ENV === "true";
function requiredEnv(name, fallback) {
  const value = process.env[name];
  if (value && value.trim()) return value.trim();
  if (isProductionRuntime) throw new Error(`${name} must be configured for production.`);
  return fallback;
}

const policyFrameAncestors = process.env.POLICY_FRAME_ANCESTORS || "'self'";
const policyPageCsp = [
  "default-src 'self'",
  `frame-ancestors ${policyFrameAncestors}`,
  "base-uri 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' https:",
].join("; ");

const policyReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' https:",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'} ${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws'}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

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
        destination: `${requiredEnv("API_BASE_URL", "http://localhost:8080/api")}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: policyReportOnly },
        ],
      },
      {
        source: "/p/:companySlug/:policyType",
        headers: [
          { key: "Content-Security-Policy", value: policyPageCsp },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_URL: requiredEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    NEXT_PUBLIC_API_URL: requiredEnv("NEXT_PUBLIC_API_URL", "http://localhost:8080/api"),
    NEXT_PUBLIC_WS_URL: requiredEnv("NEXT_PUBLIC_WS_URL", "ws://localhost:8080/api/ws"),
    NEXT_PUBLIC_DODO_CLIENT_ID: process.env.NEXT_PUBLIC_DODO_CLIENT_ID,
    NEXT_PUBLIC_DODO_ENV: process.env.NEXT_PUBLIC_DODO_ENV || "sandbox",
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  widenClientFileUpload: false,
});
