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
}

export function ProBanner({ user, myCourses = [], totalCoursesCount = 0, onShowPaymentModal }: ProBannerProps) {
  const totalCourses = myCourses.length

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
      {myCourses.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 text-slate-900 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Trophy className="h-7 w-7 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">Դուք ունեք գրանցված դասընթացներ!</h3>
              <p className="text-sm text-slate-500">Մաղթում ենք հաջող ուսման ընթացք</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Իմ դասընթացները</h3>
          <p className="text-sm text-slate-500">
            {myCourses.length} ակտիվ դասընթաց{myCourses.length !== 1 ? 'ներ' : ''}
          </p>
        </div>
      </div>

      {/* Course Cards - Based on actual course_ids */}
      <div className="grid gap-3">
        {myCourses.map((course) => (
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
