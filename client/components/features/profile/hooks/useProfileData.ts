import { useEffect, useState, useCallback } from 'react'
import api, { userService } from '@/lib/api'
import type { UserFile } from '@/components/features/admin/types'
import type { Course } from '@/components/features/admin/types'

export interface ProfileUser {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  avatar?: string
  files?: UserFile[]
  isPaid?: boolean
  course_ids?: string[]
  [key: string]: unknown 
}

export interface Payment {
  id: string
  user_id?: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  course_id?: string
  course?: {
    title: string
  }
  createdAt: string
}

export interface UserCourse {
  id: string
  title: string
  desc: string
  status: string
  lessons?: number
  progress: number
  color?: string
  borderColor?: string
}

interface ModuleWithProgress {
  isCompleted?: boolean
  completed?: boolean
}

export interface UserStats {
  currentLessons: string
  progress: number
  points: number
  certificates: string
  [key: string]: string | number  // Index signature for compatibility
}

interface ReviewData {
  id: string
  rating: number
  comment: string
  [key: string]: unknown
}

interface UseProfileDataParams {
  authUser: ProfileUser | null
  isLoaded: boolean
}

export function useProfileData({ authUser, isLoaded }: UseProfileDataParams) {
  const [user, setUser] = useState<ProfileUser | null>(authUser)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [myReview, setMyReview] = useState<ReviewData | null>(null)
  const [myCourses, setMyCourses] = useState<UserCourse[]>([])
  const [myPayments, setMyPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)

  const extractMyReview = (res: unknown): ReviewData | null => {
    if (!res || typeof res !== 'object') return null
    const data = (res as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    
    // Try different possible structures
    const maybeData = (data as { data?: unknown }).data
    let maybeReview = (maybeData as { review?: unknown } | undefined)?.review ?? (data as { review?: unknown }).review
    
    if (!maybeReview && data) {
      const d = data as Record<string, unknown>
      if (d.id && typeof d.rating === 'number' && typeof d.comment === 'string') {
        maybeReview = data
      }
      // Check if data.data is the review
      if (!maybeReview && maybeData) {
        const md = maybeData as Record<string, unknown>
        if (md.id && typeof md.rating === 'number' && typeof md.comment === 'string') {
          maybeReview = maybeData
        }
      }
      // Check if data.review exists and is an object
      if (!maybeReview && d.review && typeof d.review === 'object') {
        maybeReview = d.review
      }
    }
    
    if (!maybeReview || typeof maybeReview !== 'object') return null
    const r = maybeReview as { id?: unknown; rating?: unknown; comment?: unknown }
    if ((typeof r.id !== 'string' && typeof r.id !== 'number') || typeof r.rating !== 'number' || typeof r.comment !== 'string') return null
    return maybeReview as ReviewData
  }

  const transformCourses = (courses: Course[]): UserCourse[] => {
    if (!Array.isArray(courses)) return []
    return courses.map((course) => {
      const c = course
      // Calculate progress from modules if available, otherwise default to 0
      let progress = 0
      const modules = c.modules
      if (modules && Array.isArray(modules) && modules.length > 0) {
        const completedModules = modules.filter((m) => {
          const mod = m as ModuleWithProgress
          return mod.isCompleted || mod.completed
        }).length
        progress = Math.round((completedModules / modules.length) * 100)
      }
      return {
        id: String(c.id),
        title: String(c.title || 'Անհայտ դասընթաց'),
        desc: String(c.description || ''),
        status: progress > 0 ? 'Ակտիվ' : 'Նոր',
        lessons: modules?.length || Number((c as { lessons_count?: number; lessons?: number }).lessons_count) || Number((c as { lessons_count?: number; lessons?: number }).lessons) || 0,
        progress: progress,
        color: 'bg-violet-50 text-violet-600',
        borderColor: 'border-violet-100'
      }
    })
  }

  const calculateStats = (courses: UserCourse[]): UserStats => {
    const avgProgress = courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
      : 0
    const completedCourses = courses.filter(c => c.progress === 100).length

    return {
      currentLessons: `${completedCourses}/${courses.length}`,
      progress: avgProgress,
      points: courses.length * 100 + completedCourses * 50,
      certificates: String(completedCourses)
    }
  }

  const buildAvatar = (u: ProfileUser | null) => {
    if (!u) return u
    if (u.avatar && typeof u.avatar === 'string') return u
    if (Array.isArray(u.files) && u.files.length) {
      const f = u.files.find((x: UserFile) => x.name_used === 'user_img') || u.files[0]
      if (f && f.name && f.ext) {
        const path = `/images/${f.table_name || 'users'}/large/${f.name}.${f.ext}`
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
        const withOrigin = (p: string) => {
          if (/^https?:\/\//i.test(apiBase)) {
            const origin = apiBase.replace(/\/api.*$/, '')
            return `${origin}${p}`
          }
          const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
          return `${prefix}${p}`
        }
        return { ...u, avatar: withOrigin(path) }
      }
    }
    return u
  }

  const fetchProfileData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingData) return
    
    try {
      setIsLoadingData(true)
      
      const [userRes, reviewRes,, paymentsRes] = await Promise.all([
        userService.getMe(),
        api.get('/api/v1/reviews/me').catch(() => {
          return { data: null }
        }),
        api.get('/api/v1/student-courses/my-courses').catch(() => {
          return { data: { data: [] } }
        }),
        api.get('/api/v1/payments').catch(() => {
          return { data: { payments: [] } }
        })
      ])

      const nextUser = (userRes.data as { user: ProfileUser }).user
      setUser(buildAvatar(nextUser))
      setMyReview(extractMyReview(reviewRes))

      // Get user's course_ids and fetch courses in parallel (not sequentially)
      const courseIds = nextUser.course_ids || []
      
      // Fetch all courses in parallel using Promise.allSettled
      const coursePromises = courseIds.map(async (courseId) => {
        try {
          const courseRes = await api.get(`/api/v1/courses/${courseId}`)
          return courseRes.data?.data || courseRes.data || null
        } catch {
          // Silently skip failed course fetches
          return null
        }
      })
      
      const courseResults = await Promise.allSettled(coursePromises)
      const courses = courseResults
        .filter((result): result is PromiseFulfilledResult<unknown> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter((course): course is NonNullable<typeof course> => course !== null)
      
      const transformedCourses = transformCourses(courses as Course[])
      setMyCourses(transformedCourses)
      setStats(calculateStats(transformedCourses))

      // Process payments data - filter by current user_id from all payments
      let payments: Payment[] = []
      const paymentsData = paymentsRes.data as { payments?: Payment[]; data?: { payments?: Payment[] } } | null
      if (Array.isArray(paymentsData?.payments)) {
        payments = paymentsData.payments
      } else if (Array.isArray(paymentsData?.data?.payments)) {
        payments = paymentsData.data.payments
      } else if (Array.isArray(paymentsData?.data)) {
        payments = paymentsData.data
      }
      
      // Filter payments by current user_id
      const currentUserId = String(nextUser.id)
      const userPayments = payments.filter((p: Payment) => String(p.user_id) === currentUserId)
      
      setMyPayments(userPayments)
    } catch (err: unknown) {
      // Handle 401 unauthorized - clear user and redirect will happen in page component
      const error = err as { response?: { status?: number } }
      if (error?.response?.status === 401) {
        setUser(null)
        return
      }
      // For other errors, fallback to authUser if available
      if (authUser) {
        setUser(buildAvatar(authUser))
      }
    } finally {
      setIsLoadingData(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]) // Only re-fetch when authUser changes

  useEffect(() => {
    if (!isLoaded) return

    // Always fetch profile data when page loads and auth is loaded
    if (authUser) {
      setUser(buildAvatar(authUser))
    }
    
    // Only fetch once when auth is loaded
    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, authUser?.id]) // Only re-run when authUser ID changes, not on every authUser object change

  return { user, setUser, isLoadingData, myReview, setMyReview, myCourses, myPayments, stats }
}
