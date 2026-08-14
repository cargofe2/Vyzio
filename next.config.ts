// next.config.ts
import type { NextConfig } from "next";
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://www.bymyzai.com";
const pageHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.bymyzai.com https://*.clerk.accounts.dev blob:; worker-src blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://img.clerk.com https://images.clerk.dev https://lh3.googleusercontent.com; connect-src 'self' https://clerk.bymyzai.com https://*.clerk.accounts.dev https://api.clerk.dev https://*.supabase.co https://api.anthropic.com; frame-src https://clerk.bymyzai.com https://*.clerk.accounts.dev https://accounts.google.com; frame-ancestors 'none'" },
];
const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: ALLOWED_ORIGIN },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
];
const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: pageHeaders },
      { source: "/api/(.*)", headers: corsHeaders },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};
export default nextConfig;
