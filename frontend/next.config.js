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

/**
 * Strict CSP for production. Removes `'unsafe-inline'` and `'unsafe-eval'`
 * from script-src; Tailwind + Sentry inline styles are handled with hashed
 * nonces by Next.js when CSP is enforced.
 */
const policyEnforced = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' https: data:",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'} ${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws'} https://*.sentry.io https://*.ingest.sentry.io`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Lenient CSP for non-production builds where Next.js dev server uses
 * `'unsafe-eval'` for HMR. We send this as `Content-Security-Policy-Report-Only`
 * in dev so it does not break local development.
 */
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
    remotePatterns: [
      { protocol: "https", hostname: "**.zenvyra.com" },
      { protocol: "https", hostname: "cdn.zenvyra.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
    ],
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
    // Production: ENFORCE CSP. Non-production: report-only so local dev
    // keeps working (Next.js dev server relies on 'unsafe-eval' for HMR).
    const mainCspHeader = isProductionRuntime
      ? { key: "Content-Security-Policy", value: policyEnforced }
      : { key: "Content-Security-Policy-Report-Only", value: policyReportOnly };

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          mainCspHeader,
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
