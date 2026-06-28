import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@orbit/ui',
    '@orbit/canvas',
    '@orbit/ai',
    '@orbit/database',
    '@orbit/auth',
    '@orbit/config',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
