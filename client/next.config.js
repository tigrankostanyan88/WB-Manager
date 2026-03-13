/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './',
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://localhost:3300/images/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3300/api/:path*',
      },
    ]
  },
}

export default nextConfig
