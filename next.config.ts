import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: { root: __dirname },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "static.xx.fbcdn.net",
      },
    ],
  },
  // experimental: {
  typedRoutes: true, // Enable typed routes for better type safety
  // optimizePackageImports: ["react-icons", "@heroicons/react"], // Optimize imports
  // },
  // swcMinify: true, // Enable SWC minification for better performance
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  async redirects() {
    return [
      // PDF library merged into the unified "All Novels" page.
      { source: "/pdf", destination: "/novel", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
