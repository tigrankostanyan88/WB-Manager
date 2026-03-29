// modals/auth/types.ts - Auth modal shared types

import type { User } from '@/lib/auth'

export type AuthMode = 'signin' | 'signup'

export interface AuthFormData {
  name: string
  email: string
  phone: string
  address: string
  password: string
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface AuthResponse {
  user?: User
  token?: string
}
