'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle, Lock, Trophy, BookOpen } from 'lucide-react'

interface UserCourse {
  id: string
  title: string
  desc: string
  status: string
  lessons?: number
  progress: number
  color?: string
  borderColor?: string
}

interface ProBannerProps {
  user?: { 
    role?: string 
    name?: string
    course_ids?: (string | number)[]
    courseIds?: (string | number)[]
  }
  myCourses?: UserCourse[]
  totalCoursesCount?: number
  onShowPaymentModal: () => void
  isLoading?: boolean
}

export function ProBanner({ user, myCourses, totalCoursesCount = 0, onShowPaymentModal, isLoading }: ProBannerProps) {
  // Normalize myCourses to always be an array
  const courses = Array.isArray(myCourses) ? myCourses : []
  
  // Check if user has course_ids in their profile (indicates they should have courses)
  const userHasCourseIds = Boolean(
    user?.course_ids && user.course_ids.length > 0
  )
  
  // Show loading skeleton:
  // 1. While data is loading (isLoading=true)
  // 2. OR if user has course_ids but courses array is empty (data is being refreshed)
  const shouldShowLoading = isLoading || (userHasCourseIds && courses.length === 0)
  
  if (shouldShowLoading) {
    return (
      <div className="rounded-2xl bg-slate-100 border border-slate-200 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  const totalCourses = courses.length

  // If no courses at all (no course_ids)
  if (totalCourses === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/60 p-6 text-slate-900 shadow-xl relative overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 via-orange-100/40 to-amber-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/20 rounded-full blur-xl -ml-5 -mb-5" />
        
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Դասընթացներ չկան</h3>
            <p className="text-sm text-slate-500">Դուք դեռ չեք գնել որևէ դասընթաց</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Welcome Message - Show when user has registered courses */}
      {courses.length > 0 && (
        <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-violet-50 border border-emerald-100 p-6 text-slate-900 shadow-lg shadow-emerald-100/50 overflow-hidden group">
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-violet-200/30 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/20 to-emerald-200/20 rounded-full blur-xl -ml-5 -mb-5 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 group-hover:scale-105 transition-all duration-300">
              <Trophy className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-violet-700 bg-clip-text text-transparent">
                Դուք ունեք գրանցված դասընթացներ!
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Մաղթում ենք հաջող ուսման ընթացք 🎉</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Իմ դասընթացները</h3>
          <p className="text-sm text-slate-500">
            {courses.length} ակտիվ դասընթաց{courses.length !== 1 ? 'ներ' : ''}
          </p>
        </div>
      </div>

      {/* Course Cards - Based on actual course_ids */}
      <div className="grid gap-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-bold text-slate-900">
                {course.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{course.lessons || 0} դաս</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Ակտիվ</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              ԱԿՏԻՎ
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
