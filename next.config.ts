import type { NextConfig } from 'next'

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
    ],
  },
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  turbopack: {
    // eslint-disable-next-line node/prefer-global/process
    root: process.cwd(),
  },
}

export default nextConfig
