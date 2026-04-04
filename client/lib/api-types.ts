/**
 * API Types and Interfaces
 * Centralized type definitions for API requests/responses
 */

// User related types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: 'user' | 'admin'
  avatar?: string
  isPaid?: boolean
  files?: UserFile[]
  course_ids?: (string | number)[]
  createdAt?: string
  updatedAt?: string
}

export interface UserFile {
  name_used?: string
  name?: string
  ext?: string
  table_name?: string
}

export interface UpdateMeData {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdatePasswordData {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}

// Payment related types
export interface Payment {
  id: string | number
  user_id: string | number
  course_id: string | number
  amount: number
  payment_method: string
  status: 'pending' | 'success' | 'failed'
  transaction_id?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreatePaymentData {
  user_id: string | number
  course_id: string | number
  amount: number
  payment_method: string
}

// Message/Chat types
export interface Message {
  id: string | number
  senderId: string | number
  receiverId: string | number
  message: string
  createdAt?: string
}

export interface SendMessageData {
  receiverId?: number
  message: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error'
  data?: T
  message?: string
  code?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  results?: number
  total?: number
  page?: number
  pages?: number
}
