/** @type {import('next').NextConfig} */
const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
const apiOrigin = /^https?:\/\//.test(apiBase) ? apiBase.replace(/\/api\/?$/, '') : apiBase
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
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
    typedRoutes: false
  },
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
      }
    ]
  }
}

export default nextConfig
