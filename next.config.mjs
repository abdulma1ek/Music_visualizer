/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com"
      }
    ]
  },
  env: {
    NEXT_PUBLIC_DEMO_AUDIO_BASE_URL: process.env.DEMO_AUDIO_BASE_URL,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_SRC: process.env.DEMO_AUDIO_TRACK_SRC,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_TITLE: process.env.DEMO_AUDIO_TRACK_TITLE,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_ARTIST: process.env.DEMO_AUDIO_TRACK_ARTIST,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_COVER: process.env.DEMO_AUDIO_TRACK_COVER,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_ACCENT: process.env.DEMO_AUDIO_TRACK_ACCENT,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_DESCRIPTION: process.env.DEMO_AUDIO_TRACK_DESCRIPTION,
    NEXT_PUBLIC_DEMO_AUDIO_TRACK_DURATION: process.env.DEMO_AUDIO_TRACK_DURATION
  },
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["three"]
  }
};

export default nextConfig;
