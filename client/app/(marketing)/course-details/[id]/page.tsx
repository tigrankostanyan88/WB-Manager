'use client'

import { useParams, useRouter } from 'next/navigation'
import { CourseModulesList } from '@/components/features/course'
import { CourseHero, type CourseHeroData } from '@/components/features/course'
import { WhatYouLearn } from '@/components/features/course'
import { CourseRequirements } from '@/components/features/course'
import { CourseDescription } from '@/components/features/course'
import { CourseInstructors } from '@/components/features/course'
import { CourseSidebar } from '@/components/features/course'
import { useCourseDetails } from './hooks/useCourseDetails'
import { useStartCourse } from './hooks/useStartCourse'
import { calculatePriceDisplay } from './utils'

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string

  const {
    course,
    instructor,
    loading,
    error,
    hasAccess,
    realRating,
    realReviewsCount,
    previewVideoUrl,
    learnItems,
    requirements,
    includes,
    courseModules,
    videosText
  } = useCourseDetails(courseId)

  const { modulesSectionRef, handleStartCourse } = useStartCourse()
  const router = useRouter()
  
  const handleOtherCoursesClick = () => {
    router.push('/course')
  }

  // Loading state
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

  // Error state
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

  // Course hero data
  const courseHero: CourseHeroData = {
    title: course.title,
    description: course.description,
    rating: realRating,
    reviewsCount: realReviewsCount,
    studentsLabel: `${course.studentsCount || 0} ուսանող`,
    author: course.author || 'WB-Manager Team',
    updatedAt: course.updatedAt
      ? new Date(course.updatedAt).toLocaleDateString('hy-AM', { year: 'numeric', month: 'long' })
      : 'Հունվար 2024',
    language: course.language === 'ARM' ? 'Հայերեն' : course.language || 'Հայերեն',
    category: course.category,
    duration: course.duration,
    image: course.image,
    previewVideoUrl,
    thumbnailTime: course.thumbnail_time
  }

  // Price display
  const { price, originalPrice, discount } = calculatePriceDisplay(course.price, course.discount)

  // Handle start course
  const onStartCourse = () => {
    const firstVideo = getFirstVideo()
    handleStartCourse(firstVideo)
  }

  return (
    <div className="min-h-screen bg-white">
      <CourseHero course={courseHero} onStartCourse={onStartCourse} />

      <main className="container max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-10 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 space-y-10">
            <WhatYouLearn learn={learnItems} />
            <div ref={modulesSectionRef} id="course-modules">
              <CourseModulesList modules={courseModules} />
            </div>
            <CourseRequirements requirements={requirements} />
            <CourseDescription />
            <CourseInstructors instructor={instructor ? { ...instructor, coursesText: videosText } : null} />
          </div>

          <CourseSidebar
            price={price}
            originalPrice={originalPrice}
            discount={discount}
            includes={includes}
            modules={course.modules}
            isEnrolled={hasAccess}
            onConsultationClick={handleOtherCoursesClick}
          />
        </div>
      </main>
    </div>
  )
}
