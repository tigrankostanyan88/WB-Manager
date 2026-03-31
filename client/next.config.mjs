/** @type {import('next').NextConfig} */
const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
const apiOrigin = /^https?:\/\//.test(apiBase) ? apiBase.replace(/\/api\/?$/, '') : apiBase
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3300',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3300',
        pathname: '/api/images/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  compiler: {
    styledComponents: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: false,
  },
  // Optimize for faster navigation
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/user/:path*',
        destination: `${apiOrigin}/api/user/:path*`
      },
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin}/api/v1/:path*`
      },
      {
        source: '/api/images/:path*',
        destination: `${apiOrigin}/api/images/:path*`
      },
      {
        source: '/files/:path*',
        destination: `${apiOrigin}/files/:path*`
      },
      {
        source: '/images/:path*',
        destination: `${apiOrigin}/images/:path*`
      }
    ]
  }
}

export default nextConfig
