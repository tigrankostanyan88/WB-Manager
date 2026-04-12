/**
 * Domain Entity Types
 * Core business entities used across the application
 */

// User entity
export interface User {
  id: string | number
  name?: string
  email: string
  phone?: string
  address?: string
  role?: 'user' | 'admin'
  avatar?: string
  isPaid?: boolean
  files?: UserFile[]
  course_ids?: (string | number)[]
  createdAt?: string
  updatedAt?: string
}

export interface UserFile {
  id?: string | number
  name?: string
  name_used?: string
  ext?: string
  table_name?: string
}

// Course entity
export interface Course {
  id: string | number
  title?: string
  description?: string
  price?: number
  image?: string
  status?: 'active' | 'inactive' | 'draft'
  createdAt?: string
  updatedAt?: string
}

// Payment entity
export type PaymentStatus = 'pending' | 'success' | 'failed'
export type PaymentMethod = 'idram' | 'ameria' | 'acba'

export interface Payment {
  id: number
  user_id: number
  course_id: number
  amount: number | string
  payment_method: PaymentMethod
  status: PaymentStatus
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  course?: {
    title?: string
  }
}

// Module entity
export interface Module {
  id: string | number
  title: string
  courseId: string | number
  description?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

// Review/Comment entity
export interface Review {
  id: string | number
  user_id?: string | number
  course_id?: string | number
  rating?: number
  comment?: string
  createdAt?: string
  user?: User
}

// Instructor entity
export interface Instructor {
  id?: string | number
  title?: string
  name?: string
  profession?: string
  description?: string
  badgeText?: string
  avatarUrl?: string
  avatar?: string
  stats?: InstructorStat[]
}

export interface InstructorStat {
  value: string
  label: string
  icon?: 'users' | 'revenue' | 'experience' | 'support'
}

// FAQ entity
export interface Faq {
  id: string | number
  question: string
  answer: string
  order?: number
}

// Enrollment entity
export interface Enrollment {
  id: string | number
  user_id: string | number
  course_id: string | number
  status?: 'active' | 'completed' | 'cancelled'
  progress?: number
  createdAt?: string
}

// Contact Message entity
export interface ContactMessage {
  id: string | number
  name: string
  email: string
  subject?: string
  message: string
  isRead?: boolean
  createdAt?: string
}

// Hero Content entity
export interface HeroContent {
  id: number
  title: string
  name: string
  text: string
  thumbnail_time?: number
  video_url?: string
  file?: {
    name: string
    ext: string
    type: string
  }
  created_at?: string
  updated_at?: string
}

// Course Registration entity
export interface CourseRegistration {
  id: string | number
  user_id: string | number
  course_id: string | number
  status?: 'pending' | 'confirmed' | 'cancelled'
  createdAt?: string
}

// Settings entity
export interface Settings {
  siteName?: string
  phone?: string
  email?: string
  address?: string
  bankCard?: string
  facebook?: string
  instagram?: string
  telegram?: string
  whatsapp?: string
  workingHours?: string
  logo?: string
}
