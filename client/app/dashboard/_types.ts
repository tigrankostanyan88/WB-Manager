export type DashboardTabId =
  | 'overview'
  | 'users'
  | 'students'
  | 'courses'
  | 'modules'
  | 'comments'
  | 'instructor'
  | 'faq'
  | 'settings'

export interface User {
  id: number | string
  name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'user' | 'student' | string
  isPaid?: boolean
  createdAt?: string
  [key: string]: unknown
}

export interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export interface FAQ {
  id: number
  question: string
  answer: string
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface WorkingHoursDay {
  open: string
  close: string
  closed: boolean
}

export type WorkingHoursSchedule = Record<DayKey, WorkingHoursDay>

export interface SiteSettings {
  siteName: string
  phone: string
  email: string
  address: string
  facebook: string
  instagram: string
  telegram: string
  whatsapp: string
  logo: string
  logoFile: File | null
}

export interface InstructorStat {
  value: string
  label: string
}

export interface InstructorForm {
  description: string
  avatarUrl: string
  avatarFile: File | null
  avatarName: string
  videoUrl: string
  videoFile: File | null
  videoName: string
  stats: InstructorStat[]
}

export interface InstructorErrors {
  description: boolean
  stats: boolean[]
  video?: boolean
}

export interface ToastState {
  message: string
  type: 'success' | 'error'
}

