// types/instructor.ts - Instructor types for landing page

export interface InstructorStat {
  value: string
  label: string
  icon?: 'users' | 'revenue' | 'experience' | 'support'
}

export interface Instructor {
  id?: string
  name: string
  title?: string
  profession?: string
  description?: string
  badgeText?: string
  avatarUrl?: string
  avatar?: string
  stats?: InstructorStat[]
}

export interface InstructorApiItem {
  id?: string
  name?: string
  title?: string
  profession?: string
  description?: string
  avatar_url?: string
  stats_json?: string
}

export interface InstructorApiResponse {
  instructor?: Instructor
  instructors?: InstructorApiItem[]
  success?: boolean
  message?: string
}
