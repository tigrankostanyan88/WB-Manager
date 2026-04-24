// Centralized API configuration
// Use this for all API-related constants
import { getApiBaseUrl } from './apiUrl'

export const API_BASE_URL = getApiBaseUrl()

export const API_ENDPOINTS = {
  users: {
    me: '/api/v1/users/me',
    updateMe: '/api/v1/users/updateme',
    updatePassword: '/api/v1/users/updateMyPassword',
    avatar: '/api/v1/users/avatar',
    list: '/api/v1/users',
    suspended: '/api/v1/users/suspended',
    logout: '/api/v1/users/logout',
  },
  messages: {
    get: (userId: string | number) => `/api/v1/message/${userId}`,
    send: '/api/v1/message',
  },
  payments: {
    list: '/api/v1/payments',
    create: '/api/v1/payments',
    verify: (orderId: string) => `/api/v1/payments/${orderId}/verify`,
  },
  settings: '/api/v1/settings',
} as const
