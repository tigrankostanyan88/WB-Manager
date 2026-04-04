'use client'

import { useQuery } from '@tanstack/react-query'
import { userService } from '@/lib/api'
import api from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import type { DashboardTabId, User } from '@/components/features/admin/types'

interface StatCounts {
  students: number
  courses: number
  reviews: number
  activeUsers: number
}

interface OverviewData {
  recentStudents: User[]
  statCounts: StatCounts
}

interface UseOverviewParams {
  activeTab: DashboardTabId
  allowed: boolean
}

const fetchOverviewData = async (): Promise<OverviewData> => {
  // Fetch all required data in parallel
  const [resUsers, resEnrollments, resCourses, resReviews] = await Promise.all([
    userService.getAllUsers(),
    api.get('/api/v1/student-courses'),
    api.get('/api/v1/courses'),
    api.get('/api/v1/reviews'),
  ])

  // Process users data
  const allUsers = ((resUsers.data as { users?: User[] })?.users || []) as User[]
  const recentStudents = allUsers
    .filter((u) => u.role === 'student')
    .sort((a, b) => new Date(String(b.createdAt || 0)).getTime() - new Date(String(a.createdAt || 0)).getTime())
    .slice(0, 5)

  const activeUsersCount = allUsers.filter((u) => u.role === 'user').length

  // Process enrollments
  const enrollmentsData = Array.isArray(resEnrollments.data)
    ? resEnrollments.data
    : (resEnrollments.data?.data || [])
  const studentsCount = Array.isArray(enrollmentsData) ? enrollmentsData.length : 0

  // Process courses
  const coursesData = Array.isArray(resCourses.data?.data)
    ? resCourses.data.data
    : (resCourses.data?.data?.courses || resCourses.data?.courses || [])
  const coursesCount = Array.isArray(coursesData) ? coursesData.length : 0

  // Process reviews
  const payload = resReviews.data as { reviews?: unknown; data?: unknown }
  let reviewsList: unknown[] = []
  if (Array.isArray(payload.reviews)) {
    reviewsList = payload.reviews
  } else if (payload.data && typeof payload.data === 'object') {
    const inner = payload.data as { reviews?: unknown }
    if (Array.isArray(inner.reviews)) reviewsList = inner.reviews
  }
  const reviewsCount = reviewsList.length

  return {
    recentStudents,
    statCounts: {
      students: studentsCount,
      courses: coursesCount,
      reviews: reviewsCount,
      activeUsers: activeUsersCount,
    },
  }
}

export default function useOverview({ activeTab, allowed }: UseOverviewParams) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.overview,
    queryFn: fetchOverviewData,
    enabled: allowed && activeTab === 'overview',
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const relativeTime = (iso?: string) => {
    if (!iso) return ''
    const dt = new Date(iso)
    const diffMs = Date.now() - dt.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins} րոպե առաջ`
    const hrs = Math.floor(mins / 60)
    if (hrs < 48) return `${hrs} ժամ առաջ`
    const days = Math.floor(hrs / 24)
    return `${days} օր առաջ`
  }

  return {
    recentStudents: data?.recentStudents ?? [],
    isRecentLoading: isLoading,
    statCounts: data?.statCounts ?? { students: 0, courses: 0, reviews: 0, activeUsers: 0 },
    relativeTime,
  }
}
