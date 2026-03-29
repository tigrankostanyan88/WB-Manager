'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { buildVideoUrl } from '@/lib/videoUtils'
import CourseModulesList from '@/components/features/course/CourseModulesList'
import { useAuth } from '@/lib/auth'
import CourseHero, { type CourseHeroData } from '@/components/features/course/CourseHero'
import WhatYouLearn from '@/components/features/course/WhatYouLearn'
import CourseRequirements from '@/components/features/course/CourseRequirements'
import CourseDescription from '@/components/features/course/CourseDescription'
import CourseInstructors, { type Instructor } from '@/components/features/course/CourseInstructors'
import CourseSidebar from '@/components/features/course/CourseSidebar'

// Format duration from seconds or string to readable format
function formatDuration(duration: string | number | undefined): string {
  if (!duration) return '15:00'
  
  // If it's already a formatted string like "15:00" or "1:30:00", return as is
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration
  }
  
  // Convert to number (seconds)
  const totalSeconds = typeof duration === 'string' ? parseInt(duration, 10) : duration
  
  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    return '15:00'
  }
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface CourseData {
  id: string | number
  title: string
  description: string
  category?: string
  prerequisites?: string
  duration?: string
  language?: string
  price: number | string
  discount?: number | string
  whatToLearn?: string[]
  modules?: unknown[]
  author?: string
  rating?: number
  reviewsCount?: number
  studentsCount?: number
  updatedAt?: string
  image?: string
  thumbnail_time?: number
}

// Extended user type with course_ids from API
interface UserWithCourses {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role?: string
  avatar?: string
  course_ids?: (string | number)[]
  isPaid?: boolean
}

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string
  const { user, isLoggedIn } = useAuth()

  const [course, setCourse] = useState<CourseData | null>(null)
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [realRating, setRealRating] = useState<number>(4.9)
  const [realReviewsCount, setRealReviewsCount] = useState<number>(0)

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
        const userCourseIds = typedUser?.course_ids || []
        const numericCourseId = Number(courseId)
        const hasCourseAccess = userCourseIds.some((id) => 
          id === courseId || id === numericCourseId || String(id) === courseId
        )
        
        if (hasCourseAccess) {
          setHasAccess(true)
        } else {
          // Check via API if not in user's course list
          const res = await api.get(`/api/v1/student-courses/access/${courseId}`)
          setHasAccess(res.data?.hasAccess || false)
        }
      } catch {
        setHasAccess(false)
      } finally {
        setCheckingAccess(false)
      }
    }
    
    checkAccess()
  }, [courseId, isLoggedIn, user])

  useEffect(() => {
    if (!courseId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch course data
        const courseRes = await api.get(`/api/v1/courses/${courseId}`)
        const courseData = courseRes.data?.data || courseRes.data?.course || courseRes.data
        setCourse(courseData)
        
        // Fetch reviews and calculate real rating
        let calculatedRating = 4.9
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
            setRealRating(calculatedRating)
            setRealReviewsCount(calculatedCount)
          }
        } catch {
          // Keep default values if reviews fetch fails
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
              ratingText: `${calculatedRating} վարկանիշ`,
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
            ratingText: `${calculatedRating} վարկանիշ`,
            coursesText: '0 վիդեոդաս'
          })
        }
      } catch {
        setError('Դասընթացը չի գտնվել')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-violet-600 mx-auto" />
            <p className="text-slate-500 font-medium">Բեռնվում է...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{error || 'Դասընթացը չի գտնվել'}</h1>
          <p className="text-slate-500">Խնդրում ենք ստուգել հասցեն կամ փորձել կրկին</p>
        </div>
      </div>
    )
  }

  // Find first video for preview
  const getFirstVideoUrl = () => {
    if (!course.modules) return null
    for (const m of course.modules) {
      const mm = m as { files?: unknown[] }
      const files = Array.isArray(mm.files) ? mm.files : []
      for (const f of files) {
        const ff = f as { name?: string; ext?: string; name_used?: string }
        const isVideo = ff.name_used === 'module_video' || 
          (ff.ext && ['mp4', 'webm', 'mov'].includes(String(ff.ext).toLowerCase()))
        if (isVideo && ff.name && ff.ext) {
          return buildVideoUrl(ff.name, ff.ext)
        }
      }
    }
    return null
  }
  const previewVideoUrl = getFirstVideoUrl()

  const courseHero: CourseHeroData = {
    title: course.title,
    description: course.description,
    rating: realRating,
    reviewsCount: realReviewsCount,
    studentsLabel: `${course.studentsCount || 0} ուսանող`,
    author: course.author || 'WB-Manager Team',
    updatedAt: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('hy-AM', { year: 'numeric', month: 'long' }) : 'Հունվար 2024',
    language: course.language === 'ARM' ? 'Հայերեն' : course.language || 'Հայերեն',
    image: course.image,
    previewVideoUrl: previewVideoUrl,
    thumbnailTime: course.thumbnail_time
  }

  const learn = course.whatToLearn || [
    'Ապրանքի ընտրություն և մատակարարների հետ աշխատանքի հիմունքներ',
    'Քարտերի ստեղծում և օպտիմալացում Wildberries-ում',
    'Լոգիստիկա, գների մոդելավորում և շահութաբերություն',
    'Մարքեթինգ, ակցիաներ և մասշտաբավորում',
    'Վաճառքի վերլուծություն և հաշվետվությունների կազմում',
    'Մրցակիցների վերլուծություն և ռազմավարության մշակում'
  ]

  const requirements = [
    'Համակարգիչ կամ նոութբուկ ինտերնետ հասանելիությամբ',
    'Wildberries-ում գրանցված գործընկերոջ հաշիվ (ցանկալի է, բայց պարտադիր չէ)',
    'Սովորելու և կիրառելու պատրաստակամություն'
  ]

  const includes = [
    `${course.duration || '6 ժամ'} ընդհանուր տևողություն`,
    '12 ներբեռնվող ռեսուրսներ',
    'Անսահմանափակ մուտք',
    'Հասանելի բջջայինով և TV-ով',
    'Ավարտական վկայական'
  ]

  const price = typeof course.price === 'number' ? `${course.price} դրամ` : `${course.price} դրամ`
  const originalPrice = course.discount ? `${Number(course.price) * 2} դրամ` : ''
  const discount = course.discount ? `${course.discount}% ԶԵՂՉ` : ''

  // Course modules with videos inside for CourseModulesList component
  const courseModules = (course.modules || []).map((m: unknown, index: number) => {
    const mm = m as { 
      id?: unknown
      title?: unknown 
      name?: unknown
      duration?: unknown
      files?: unknown[] 
    }
    const moduleTitle = String(mm.title || mm.name || `Մոդուլ ${index + 1}`)
    const moduleId = String(mm.id || index)
    const moduleDuration = String(mm.duration) || '45 րոպե'
    const files = Array.isArray(mm.files) ? mm.files : []
    
    // Map files to videos
    const videos = files.map((f: unknown, idx: number) => {
      const ff = f as { 
        id?: string | number
        name?: string
        ext?: string
        name_used?: string
        title?: string
        duration?: string
      }
      const isVideo = ff.name_used === 'module_video' || 
        (ff.ext && ['mp4', 'webm', 'mov'].includes(String(ff.ext).toLowerCase()))
      
      // Build video URL for thumbnail generation
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
    }).filter(video => video.type === 'video') // Only videos
    
    return {
      id: moduleId,
      title: moduleTitle,
      lectures: videos.length,
      duration: moduleDuration,
      videos: videos
    }
  })

  // Calculate total videos count for instructor card
  const totalVideos = courseModules.reduce((sum, module) => sum + (module.videos?.length || 0), 0)
  const videosText = totalVideos > 0 ? `${totalVideos} վիդեոդաս` : '12 դասընթաց'

  // Find first available video for "Start Course"
  const getFirstVideo = () => {
    for (const module of courseModules) {
      for (const video of module.videos) {
        if (!video.isLocked && video.videoUrl) {
          return video
        }
      }
    }
    return null
  }

  const modulesSectionRef = useRef<HTMLDivElement>(null)

  const handleStartCourse = () => {
    const firstVideo = getFirstVideo()
    if (firstVideo && typeof window !== 'undefined') {
      // Scroll to modules section using ref
      modulesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      // Store video id for CourseModulesList to read
      localStorage.setItem('playVideoId', String(firstVideo.id))
      // Dispatch custom event for same-tab communication
      window.dispatchEvent(new Event('startCourse'))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <CourseHero course={courseHero} onStartCourse={handleStartCourse} />

      <main className="container max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-10 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 space-y-10">
            <WhatYouLearn learn={learn} />
            <div ref={modulesSectionRef} id="course-modules">
              <CourseModulesList modules={courseModules} />
            </div>
            <CourseRequirements requirements={requirements} />
            <CourseDescription />
            <CourseInstructors instructor={instructor ? {...instructor, coursesText: videosText} : null} />
          </div>

          <CourseSidebar price={price} originalPrice={originalPrice} discount={discount} includes={includes} modules={course.modules} isEnrolled={hasAccess} />
        </div>
      </main>
    </div>
  )
}
