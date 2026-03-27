export type DashboardTabId =
  | 'overview'
  | 'users'
  | 'suspended-users'
  | 'courses'
  | 'modules'
  | 'comments'
  | 'instructor'
  | 'faq'
  | 'settings'
  | 'payments'
  | 'bank-cards'
  | 'enrollments'
  | 'course-registrations'
  | 'contact-messages'

export interface User {
  id: number | string
  name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'user' | 'student' | string
  isPaid?: boolean
  createdAt?: string
  files?: any[]
  [key: string]: unknown
}

export interface Review {
  id: number | string
  _id?: string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
  updatedAt?: string
  user?: User & { files?: any[] }
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
  firstName: string
  lastName: string
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
  title: string
  name: string
  profession: string
  description: string
  badgeText: string
  avatarUrl: string
  avatarFile: File | null
  stats: InstructorStat[]
}

export interface InstructorErrors {
  name: boolean
  profession: boolean
  description: boolean
  stats: boolean[]
}

export interface ToastState {
  message: string
  type: 'success' | 'error'
}

