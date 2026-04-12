'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import api from '@/lib/api'
import { buildVideoUrl } from '@/lib/videoUtils'
import { useAuth } from '@/lib/auth'
import type { Instructor } from '@/components/features/course/CourseInstructors'
import type { CourseData, UserWithCourses, CourseModuleData, CourseModuleFile } from '../types'
import { formatDuration, getDefaultLearnItems, getDefaultRequirements, getDefaultIncludes } from '../utils'

interface UseCourseDetailsResult {
  course: CourseData | null
  instructor: Instructor | null
  loading: boolean
  error: string | null
  hasAccess: boolean
  checkingAccess: boolean
  realRating: number
  realReviewsCount: number
  // Derived data
  previewVideoUrl: string | null
  learnItems: string[]
  requirements: string[]
  includes: string[]
  courseModules: CourseModuleWithVideos[]
  videosText: string
  // Actions
  refresh: () => void
}

interface CourseModuleWithVideos {
  id: string
  title: string
  lectures: number
  duration: string
  videos: CourseVideo[]
}

interface CourseVideo {
  id: string | number
  title: string
  duration: string
  fileName: string
  type: 'video' | 'file'
  isLocked: boolean
  videoUrl?: string
}

export function useCourseDetails(courseId: string): UseCourseDetailsResult {
  const { user, isLoggedIn } = useAuth()

  const [course, setCourse] = useState<CourseData | null>(null)
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [realRating, setRealRating] = useState<number>(0)
  const [realReviewsCount, setRealReviewsCount] = useState<number>(0)

  // Check access effect
  useEffect(() => {
    if (!courseId || !isLoggedIn) {
      setCheckingAccess(false)
      return
    }

    const checkAccess = async () => {
      try {
        // Admin has full access to all courses
        const userRole = user?.role
        if (userRole === 'admin') {
          setHasAccess(true)
          setCheckingAccess(false)
          return
        }

        // Check if user's course_ids array contains this courseId
        const typedUser = user as UserWithCourses
        let userCourseIds = typedUser?.course_ids || []
        // Ensure course_ids is always an array (handle JSON string case)
        if (typeof userCourseIds === 'string') {
          try {
            userCourseIds = JSON.parse(userCourseIds)
          } catch {
            userCourseIds = []
          }
        }
        if (!Array.isArray(userCourseIds)) {
          userCourseIds = []
        }
        const numericCourseId = Number(courseId)
        const hasCourseAccess = userCourseIds.some((id: string | number) =>
          id === courseId || id === numericCourseId || String(id) === courseId
        )

        if (hasCourseAccess) {
          setHasAccess(true)
        } else {
          const res = await api.get(`/api/v1/student-courses/access/${courseId}`)
          setHasAccess(res.data?.hasAccess || false)
        }
      } catch (err) {
        setHasAccess(false)
      } finally {
        setCheckingAccess(false)
      }
    }

    checkAccess()
  }, [courseId, isLoggedIn, user])

  // Fetch course data effect
  const fetchData = useCallback(async () => {
    if (!courseId) return

    try {
      setLoading(true)

      // Fetch course data
      const courseRes = await api.get(`/api/v1/courses/${courseId}`)
      const courseData = courseRes.data?.data || courseRes.data?.course || courseRes.data
      setCourse(courseData)

      // Fetch reviews and calculate real rating
      let calculatedRating = 0
      let calculatedCount = 0
      try {
        const reviewsRes = await api.get('/api/v1/reviews')
        const payload = reviewsRes.data as { data?: { reviews?: Array<{ rating?: number }> } }
        const reviews = payload.data?.reviews || []

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
          const avgRating = totalRating / reviews.length
          calculatedRating = Number(avgRating.toFixed(1))
          calculatedCount = reviews.length
        }
        setRealRating(calculatedRating)
        setRealReviewsCount(calculatedCount)
      } catch {
        // Reset to 0 if reviews fetch fails
        setRealRating(0)
        setRealReviewsCount(0)
      }

      // Fetch instructor data
      try {
        const instructorRes = await api.get('/api/v1/instructor')
        const payload = instructorRes.data?.data || instructorRes.data
        const list = Array.isArray(payload?.instructors) ? payload.instructors : Array.isArray(payload) ? payload : []
        const instructorData = list[0] || payload

        if (instructorData && typeof instructorData === 'object') {
          const data = instructorData as Record<string, unknown>

          // Get avatar from files array
          let imageUrl = ''
          const files = data.files as Array<{ name_used?: string; name?: string; ext?: string }> | undefined
          if (files && Array.isArray(files)) {
            const avatarFile = files.find((f) =>
              f.name_used === 'instructor_img' ||
              f.name_used === 'avatar' ||
              f.name_used === 'instructor_avatar'
            )
            if (avatarFile?.name && avatarFile?.ext) {
              const ext = avatarFile.ext.startsWith('.') ? avatarFile.ext : `.${avatarFile.ext}`
              imageUrl = `/images/instructors/large/${avatarFile.name}${ext}`
            }
          }

          // Fallback to avatar_url
          if (!imageUrl && typeof data.avatar_url === 'string') {
            imageUrl = data.avatar_url
          }

          setInstructor({
            name: typeof data.name === 'string' ? data.name : 'WB-Manager Team',
            role: typeof data.profession === 'string' ? data.profession : 'Գլխավոր մենթոր',
            desc: typeof data.description === 'string' ? data.description : 'Փորձառու մասնագետ WB ոլորտում',
            imageUrl: imageUrl || '',
            ratingText: calculatedRating > 0 ? `${calculatedRating} վարկանիշ` : 'Դեռ չի գնահատվել',
            coursesText: '0 վիդեոդաս'
          })
        }
      } catch {
        // Fallback to default instructor if API fails
        setInstructor({
          name: 'WB-Manager Team',
          role: 'Գլխավոր մենթոր',
          desc: 'Փորձառու մասնագետ WB ոլորտում',
          imageUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop',
          ratingText: calculatedRating > 0 ? `${calculatedRating} վարկանիշ` : 'Դեռ չի գնահատվել',
          coursesText: '0 վիդեոդաս'
        })
      }
    } catch {
      setError('Դասընթացը չի գտնվել')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Derived: Find first video for preview
  const previewVideoUrl = useMemo(() => {
    if (!course?.modules) return null
    for (const m of course.modules) {
      const mm = m as CourseModuleData
      const files = Array.isArray(mm.files) ? mm.files : []
      for (const f of files) {
        const ff = f as CourseModuleFile
        const isVideo = ff.name_used === 'module_video' ||
          (ff.ext && ['mp4', 'webm', 'mov'].includes(String(ff.ext).toLowerCase()))
        if (isVideo && ff.name && ff.ext) {
          const url = buildVideoUrl(ff.name, ff.ext)
          return url
        }
      }
    }
    return null
  }, [course])

  // Derived: Learn items
  const learnItems = useMemo(() => course?.whatToLearn || getDefaultLearnItems(), [course])

  // Derived: Requirements
  const requirements = useMemo(() => getDefaultRequirements(), [])

  // Derived: Includes
  const includes = useMemo(() => getDefaultIncludes(course?.duration), [course?.duration])

  // Derived: Course modules with videos
  const courseModules = useMemo(() => {
    if (!course?.modules) return []

    return course.modules.map((m, index) => {
      const mm = m
      const moduleTitle = String(mm.title || mm.name || `Մոդուլ ${index + 1}`)
      const moduleId = String(mm.id || index)
      const moduleDuration = String(mm.duration) || '45 րոպե'
      const files = mm.files || []

      const videos = files.map((f, idx: number) => {
        const ff = f
        const isVideo = ff.name_used === 'module_video' ||
          (ff.ext && ['mp4', 'webm', 'mov'].includes(String(ff.ext).toLowerCase()))

        const videoUrl = (ff.name && ff.ext)
          ? buildVideoUrl(ff.name, ff.ext)
          : undefined

        return {
          id: ff.id || `${moduleId}-${idx}`,
          title: String(ff.title || `Վիդեոդաս ${idx + 1}`),
          duration: formatDuration(ff.duration),
          fileName: String(ff.name ? `${ff.name}.${ff.ext || ''}` : ''),
          type: isVideo ? 'video' as const : 'file' as const,
          isLocked: !hasAccess,
          videoUrl: isVideo ? videoUrl : undefined
        }
      }).filter(video => video.type === 'video')

      return {
        id: moduleId,
        title: moduleTitle,
        lectures: videos.length,
        duration: moduleDuration,
        videos
      }
    })
  }, [course, hasAccess])

  // Derived: Videos text
  const videosText = useMemo(() => {
    const totalVideos = courseModules.reduce((sum, module) => sum + module.videos.length, 0)
    return totalVideos > 0 ? `${totalVideos} վիդեոդաս` : '12 դասընթաց'
  }, [courseModules])

  return {
    course,
    instructor,
    loading,
    error,
    hasAccess,
    checkingAccess,
    realRating,
    realReviewsCount,
    previewVideoUrl,
    learnItems,
    requirements,
    includes,
    courseModules,
    videosText,
    refresh: fetchData
  }
}
