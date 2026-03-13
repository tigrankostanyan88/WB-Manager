export type DashboardTabId =
  | 'overview'
  | 'bank-cards'
  | 'users'
  | 'courses'
  | 'modules'
  | 'student-courses'
  | 'comments'
  | 'instructor'
  | 'faq'
  | 'settings'

export interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'student' | 'admin'
  isPaid?: boolean
  paidCourses?: string[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  _id: string
  title: string
  description: string
  price: number
  image?: string
  learningPoints?: string[]
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface Module {
  _id: string
  title: string
  description: string
  courseId: string
  videos?: ModuleVideo[]
  order?: number
  createdAt: string
  updatedAt: string
}

export interface ModuleVideo {
  _id: string
  title: string
  url: string
  duration?: number
  order?: number
}

export interface Review {
  _id: string
  userId: string
  userName: string
  courseId?: string
  rating: number
  comment: string
  createdAt: string
}

export interface Faq {
  _id: string
  question: string
  answer: string
  order?: number
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface Instructor {
  _id: string
  name: string
  profession: string
  description: string
  avatar?: string
  stats?: InstructorStat[]
  createdAt: string
  updatedAt: string
}

export interface InstructorStat {
  label: string
  value: string
}

export interface SiteSettings {
  siteName: string
  logo?: string
  contactEmail?: string
  contactPhone?: string
  workingHours?: WorkingHoursSchedule
  socialLinks?: {
    facebook?: string
    instagram?: string
    telegram?: string
  }
}

export interface WorkingHoursSchedule {
  monday: { start: string; end: string; isOpen: boolean }
  tuesday: { start: string; end: string; isOpen: boolean }
  wednesday: { start: string; end: string; isOpen: boolean }
  thursday: { start: string; end: string; isOpen: boolean }
  friday: { start: string; end: string; isOpen: boolean }
  saturday: { start: string; end: string; isOpen: boolean }
  sunday: { start: string; end: string; isOpen: boolean }
}

export interface StudentCourse {
  _id: string
  userId: string
  userName: string
  courseId: string
  courseName: string
  progress?: number
  isCompleted?: boolean
  enrolledAt: string
}

export interface BankCard {
  _id: string
  userId: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault?: boolean
  createdAt: string
}
