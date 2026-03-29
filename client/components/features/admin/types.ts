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
  | 'hero-content'

export interface User {
  id: number | string
  name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'user' | 'student' | string
  isPaid?: boolean
  createdAt?: string
  files?: UserFile[]
  [key: string]: unknown
}

interface UserFile {
  id?: string | number
  name?: string
  ext?: string
  name_used?: string
  table_name?: string
}

export interface Review {
  id: number | string
  _id?: string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
  updatedAt?: string
  user?: User & { files?: UserFile[] }
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
  label: string
  value: string
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

// Shared domain types - centralized to avoid duplication across hooks
export interface Course {
  id: number
  _id?: string
  title: string
  description?: string
  price?: number
  category?: string
  language?: string
  image?: string | null
  thumbnail_time?: number
  modules?: Array<{ _id?: string; id?: number; title: string; duration: string }>
  prerequisites?: string[]
  whatToLearn?: string[]
}

export interface Payment {
  id: number
  user_id: number
  course_id: number
  order_id?: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  payment_method?: 'idram' | 'ameria' | 'acba'
  transaction_id?: string
  paid_at?: string
  createdAt?: string
  user?: User
  course?: Course
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  status: 'active' | 'expired' | 'pending'
  price_paid: number
  payment_method: string
  createdAt: string
  updatedAt: string
  student?: User
  course?: Course
}

