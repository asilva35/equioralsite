/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vidashy.vercel.app'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/',
      },
      {
        protocol: 'https',
        hostname: 'vidashy.vercel.app',
        port: '80',
        pathname: '/',
      },
    ],
  },
};

export default nextConfig;
