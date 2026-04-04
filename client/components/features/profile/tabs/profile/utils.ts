// Profile tab types
import type { UserCourse, Payment } from '@/components/features/profile/hooks/useProfileData'

export interface ProfileUser {
  role?: string
  email: string
  phone: string
  address: string
  course_ids?: string[]
}

export interface StatsData {
  currentLessons?: string
  progress?: number
  points?: number
  certificates?: string
  [key: string]: unknown
}

export interface ProfileTabProps {
  user: ProfileUser
  stats: StatsData | null
  isLoadingData: boolean
  myCourses: UserCourse[]
  myPayments: Payment[]
  onViewAllCourses: () => void
}
