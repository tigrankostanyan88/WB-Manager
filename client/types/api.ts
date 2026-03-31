/**
 * API Response type definitions
 * Used for defensive parsing of API responses
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  status?: string
  data?: T
  message?: string
  user?: T
  token?: string
}

// Response with list data
export interface ApiListResponse<T = unknown> {
  status?: string
  data?: {
    items?: T[]
    list?: T[]
    data?: T[]
    courses?: T[]
    users?: T[]
    payments?: T[]
    reviews?: T[]
    instructors?: T[]
    modules?: T[]
  }
  message?: string
}

// Raw API data with unknown shape
export type ApiData = Record<string, unknown>

// Type guard for checking if value is a record/object
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Type guard for API responses
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return isRecord(value)
}

// Safe data extraction from API response
export function extractData<T>(response: unknown, defaultValue: T): T {
  if (!isRecord(response)) return defaultValue
  const data = response.data
  return data !== undefined ? (data as T) : defaultValue
}

// Safe list extraction from API response
export function extractList<T>(response: unknown): T[] {
  if (!isRecord(response)) return []
  const data = response.data
  if (!isRecord(data)) return []
  
  const list = data.items || data.list || data.data || data.courses || 
               data.users || data.payments || data.reviews || data.instructors ||
               data.modules
  return Array.isArray(list) ? list : []
}
