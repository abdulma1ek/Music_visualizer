import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['three']
  }
};

export default nextConfig;
