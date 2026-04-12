/**
 * Centralized type exports
 * All domain and API types are re-exported from here
 */

// Re-export all domain entity types (User, Course, Instructor, etc.)
export * from './domain'

// Re-export API response types and utilities
export * from './api'

// Shared base interface for entities with common fields
export interface BaseEntity {
  id: string | number
  createdAt?: string
  updatedAt?: string
}

// File attachment type (unified across all features)
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

// Admin dashboard tab identifiers
export type AdminTab =
  | 'hero-content'
  | 'courses'
  | 'modules'
  | 'users'
  | 'suspended-users'
  | 'instructor'
  | 'reviews'
  | 'comments'
  | 'payments'
  | 'enrollments'
  | 'course-registrations'
  | 'settings'
  | 'contact-messages'
  | 'faq'
  | 'bank-cards'
  | 'overview'

// Toast notification types
export type ToastType = 'success' | 'error' | 'info'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}
