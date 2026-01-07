/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize for production
  swcMinify: true,
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
}

module.exports = nextConfig

