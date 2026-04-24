const DEV_API_URL = 'http://localhost:3300'
const PROD_API_URL = 'https://api.savaa.am'

function isDevelopment(): boolean {
  // Check build-time env first
  if (process.env.NODE_ENV === 'development') return true
  
  // Client-side runtime check
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    return hostname === 'localhost' || hostname === '127.0.0.1'
  }
  
  return false
}

export function getApiBaseUrl(): string {
  // Priority 1: Auto-detect based on environment (for local development)
  if (isDevelopment()) {
    return DEV_API_URL
  }
  
  // Priority 2: Explicit env variable (for production)
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl) return envUrl.replace(/\/+$/, '')
  
  // Fallback to production URL
  return PROD_API_URL
}

/**
 * Get the API origin (base URL without /api suffix)
 * Example: http://localhost:3300 or https://api.savaa.am
 */
export function getApiOrigin(): string {
  const base = getApiBaseUrl()
  return base.replace(/\/api\/?$/, '')
}


export function buildFileUrl(path: string): string {
  if (!path) return path
  
  // If already a full URL, return as-is
  if (/^https?:\/\//i.test(path)) return path
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  const origin = getApiOrigin()
  return `${origin}${normalizedPath}`
}


export function buildApiUrl(endpoint: string): string {
  if (!endpoint) return endpoint
  
  // If already a full URL, return as-is
  if (/^https?:\/\//i.test(endpoint)) return endpoint
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  const base = getApiBaseUrl()
  return `${base}${normalizedEndpoint}`
}


export function withOrigin(path?: string): string | undefined {
  if (!path) return path
  return buildFileUrl(path)
}
