import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // lets adds some temp image domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hoirqrkdgbmvpwutwuwj.supabase.co',
        port: '',
        // pathname: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.perpetuity.dev',
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  turbopack: {

    root: process.cwd(),
  },
};

export default nextConfig;
