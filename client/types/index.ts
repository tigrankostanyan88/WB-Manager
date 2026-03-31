/**
 * Shared types for API responses and data structures
 * Used across the application to ensure type consistency
 */

// API Response wrapper types
export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}

export interface ApiListResponse<T> {
  status: string
  data: {
    items?: T[]
    list?: T[]
    data?: T[]
    courses?: T[]
    users?: T[]
    instructors?: T[]
    reviews?: T[]
    payments?: T[]
  }
  message?: string
}

// Generic API error response
export interface ApiErrorResponse {
  status: string
  code: string
  message: string
}

// Common entity fields
export interface BaseEntity {
  id: string | number
  createdAt?: string
  updatedAt?: string
}

// File attachment type
export interface FileData {
  id?: string | number
  name: string
  ext: string
  type: string
  name_used?: string
  table_name?: string
  path?: string
  path_large?: string
  path_small?: string
}

// Tab identifiers for admin dashboard
export type AdminTab =
  | 'hero-content'
  | 'courses'
  | 'modules'
  | 'users'
  | 'instructor'
  | 'reviews'
  | 'payments'
  | 'settings'
  | 'messages'
  | 'contact'
  | 'faq'
  | 'bank-cards'

// Toast notification types
export type ToastType = 'success' | 'error' | 'info'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}
