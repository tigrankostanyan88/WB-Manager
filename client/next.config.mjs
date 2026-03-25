/** @type {import('next').NextConfig} */
const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
const apiOrigin = /^https?:\/\//.test(apiBase) ? apiBase.replace(/\/api\/?$/, '') : apiBase
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
