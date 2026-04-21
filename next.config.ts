import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          'default-src \'self\'',
          'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
          'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
          'img-src \'self\' data: blob: https://cdn.100xadi.com https://cdn.perpetuity.dev https://hoirqrkdgbmvpwutwuwj.supabase.co https://images.unsplash.com https://ik.imagekit.io',
          'font-src \'self\' data: https://fonts.gstatic.com',
          'connect-src \'self\' https://api-preprod.phonepe.com https://api.phonepe.com https://apiv2.shiprocket.in https://*.r2.cloudflarestorage.com https://cdn.100xadi.com https://cdn.perpetuity.dev',
          'frame-ancestors \'none\'',
          'base-uri \'self\'',
          'form-action \'self\'',
        ].join('; '),
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

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
        hostname: 'cdn.100xadi.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.perpetuity.dev',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
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
