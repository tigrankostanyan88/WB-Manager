import { useEffect, useState } from 'react'
import api, { userService } from '@/lib/api'

export interface UserFile {
  name_used?: string
  table_name?: string
  name?: string
  ext?: string
}

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
}

export interface Payment {
  id: string
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
  logout: () => void | Promise<void>
}

export function useProfileData({ authUser, isLoaded, logout }: UseProfileDataParams) {
  const [user, setUser] = useState<ProfileUser | null>(authUser)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [myReview, setMyReview] = useState<ReviewData | null>(null)
  const [myCourses, setMyCourses] = useState<UserCourse[]>([])
  const [myPayments, setMyPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)

  const extractMyReview = (res: unknown): ReviewData | null => {
    console.log('[Profile] Raw reviews response:', res)
    if (!res || typeof res !== 'object') return null
    const data = (res as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    
    // Try different possible structures
    const maybeData = (data as { data?: unknown }).data
    let maybeReview = (maybeData as { review?: unknown } | undefined)?.review ?? (data as { review?: unknown }).review
    
    // Also try if review is directly in data or data is the review itself
    if (!maybeReview && data) {
      // Check if data itself has id, rating, comment fields (meaning data IS the review)
      const d = data as any
      if (d.id && typeof d.rating === 'number' && typeof d.comment === 'string') {
        maybeReview = data
      }
      // Check if data.data is the review
      if (!maybeReview && maybeData) {
        const md = maybeData as any
        if (md.id && typeof md.rating === 'number' && typeof md.comment === 'string') {
          maybeReview = maybeData
        }
      }
      // Check if data.review exists and is an object
      if (!maybeReview && d.review && typeof d.review === 'object') {
        maybeReview = d.review
      }
    }
    
    console.log('[Profile] Extracted review:', maybeReview)
    if (!maybeReview || typeof maybeReview !== 'object') return null
    const r = maybeReview as { id?: unknown; rating?: unknown; comment?: unknown }
    if ((typeof r.id !== 'string' && typeof r.id !== 'number') || typeof r.rating !== 'number' || typeof r.comment !== 'string') return null
    return maybeReview as ReviewData
  }

  const transformEnrollmentsToCourses = (enrollments: any[]): UserCourse[] => {
    if (!Array.isArray(enrollments)) return []
    return enrollments.map((enrollment: any) => {
      const course = enrollment.course || {}
      // Calculate progress from modules if available, otherwise default to 0
      let progress = 0
      if (course.modules && Array.isArray(course.modules) && course.modules.length > 0) {
        // Calculate based on completed modules count
        const completedModules = course.modules.filter((m: any) => m.isCompleted || m.completed).length
        progress = Math.round((completedModules / course.modules.length) * 100)
      }
      return {
        id: String(course.id || enrollment.id),
        title: course.title || 'Անհայտ դասընթաց',
        desc: course.description || '',
        status: enrollment.status === 'active' ? 'Ակտիվ' : 'Ավարտված',
        lessons: course.modules?.length || course.lessons_count || course.lessons || 0,
        progress: progress,
        color: 'bg-violet-50 text-violet-600',
        borderColor: 'border-violet-100'
      }
    })
  }

  const calculateStats = (courses: UserCourse[]): UserStats => {
    const totalLessons = courses.reduce((sum, c) => sum + (c.lessons || 0), 0)
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
      const f = u.files.find((x: any) => x.name_used === 'user_img') || u.files[0]
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

  const fetchProfileData = async () => {
    try {
      setIsLoadingData(true)
      console.log('[Profile] Fetching profile data...')
      
      const [userRes, reviewRes, coursesRes, paymentsRes] = await Promise.all([
        userService.getMe(),
        api.get('/api/v1/reviews/me').catch((err) => {
          console.log('[Profile] Reviews fetch error:', err?.response?.status || err.message)
          return { data: null }
        }),
        api.get('/api/v1/student-courses/my-courses').catch((err) => {
          console.log('[Profile] Courses fetch error:', err?.response?.status || err.message)
          return { data: { data: [] } }
        }),
        api.get('/api/v1/payments/my-payments').catch((err) => {
          console.log('[Profile] Payments fetch error:', err?.response?.status || err.message)
          return { data: { payments: [] } }
        })
      ])

      console.log('[Profile] User response:', userRes.data)
      console.log('[Profile] Courses response:', coursesRes.data)

      const nextUser = (userRes.data as { user: ProfileUser }).user
      setUser(buildAvatar(nextUser))
      setMyReview(extractMyReview(reviewRes))

      // Process courses data
      const enrollments = (coursesRes.data as any)?.data || []
      const transformedCourses = transformEnrollmentsToCourses(enrollments)
      setMyCourses(transformedCourses)
      setStats(calculateStats(transformedCourses))

      // Process payments data
      const payments = (paymentsRes.data as any)?.payments || []
      setMyPayments(payments)
    } catch (err: any) {
      console.error('[Profile] Error fetching profile data:', err)
      // Handle 401 unauthorized - clear user and redirect will happen in page component
      if (err?.response?.status === 401) {
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
  }

  useEffect(() => {
    if (!isLoaded) return

    // Always fetch profile data when page loads and auth is loaded
    // This ensures we get fresh data even if authUser is available
    if (authUser) {
      setUser(buildAvatar(authUser))
    }
    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, authUser?.id])

  return { user, setUser, isLoadingData, myReview, setMyReview, myCourses, myPayments, stats }
}
