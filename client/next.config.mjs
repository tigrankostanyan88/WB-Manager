/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const apiBase = isDev 
  ? 'http://localhost:3300'
  : (process.env.NEXT_PUBLIC_API_URL || 'https://api.savaa.am').replace(/\/+$/, '')
const apiOrigin = /^https?:\/\//.test(apiBase) ? apiBase.replace(/\/api\/?$/, '') : apiBase

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: isDev 
      ? [
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
        ]
      : [
          {
            protocol: 'https',
            hostname: 'api.savaa.am',
            pathname: '/**', 
          },
        ],
    unoptimized: true, 
  },
  compiler: {
    styledComponents: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  poweredByHeader: false,
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