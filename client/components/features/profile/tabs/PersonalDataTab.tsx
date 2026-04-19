'use client'

import { motion } from 'framer-motion'
import { User, BookOpen, Award, Percent, TrendingUp } from 'lucide-react'

interface PersonalDataTabProps {
  user?: {
    name?: string
    email?: string
    phone?: string
    role?: string
    createdAt?: string
  }
  myCoursesCount: number
  totalCoursesCount: number
  isLoadingData?: boolean
}

export function PersonalDataTab({ 
  user, 
  myCoursesCount, 
  totalCoursesCount,
  isLoadingData 
}: PersonalDataTabProps) {
  // Calculate points as percentage of courses enrolled
  const points = totalCoursesCount > 0 
    ? Math.round((myCoursesCount / totalCoursesCount) * 100) 
    : 0

  // Determine level based on points
  const getLevel = (p: number) => {
    if (p >= 80) return { label: 'Մասնագետ', color: 'text-slate-600', bg: 'bg-white border border-slate-200' }
    if (p >= 50) return { label: 'Փորձառու', color: 'text-slate-600', bg: 'bg-white border border-slate-200' }
    if (p >= 20) return { label: 'Սովորող', color: 'text-slate-600', bg: 'bg-white border border-slate-200' }
    return { label: 'Սկսնակ', color: 'text-slate-600', bg: 'bg-white border border-slate-200' }
  }

  const level = getLevel(points)

  if (isLoadingData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6 min-w-0 w-full"
    >
      {/* Points Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-4 sm:p-6 text-slate-900 w-full min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-slate-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{points} միավոր</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Ձեր առաջադիմության մակարդակը</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Առաջադիմություն</span>
            <span className="font-bold text-slate-900">{points}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-600 rounded-full transition-all duration-1000"
              style={{ width: `${points}%` }}
            />
          </div>
        </div>

        {/* Level Badge */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
          <span className="text-slate-500 text-xs sm:text-sm">Մակարդակ:</span>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${level.bg} ${level.color}`}>
            {level.label}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-slate-900">{myCoursesCount}</p>
              <p className="text-xs sm:text-sm text-slate-500">Գրանցված դասընթացներ</p>
            </div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-black text-slate-900">{totalCoursesCount}</p>
              <p className="text-xs sm:text-sm text-slate-500">Ընդհանուր դասընթացներ</p>
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 sm:col-span-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs sm:text-sm text-slate-500">Դասընթացների ծածկույթ</p>
                <p className="text-lg sm:text-xl font-black text-slate-900">{points}%</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full transition-all duration-1000"
                  style={{ width: `${points}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 w-full min-w-0 overflow-hidden">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          Անձնական տեղեկություններ
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between py-2 sm:py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm">Անուն</span>
            <span className="font-medium text-slate-900 text-sm">{user?.name || '—'}</span>
          </div>
          <div className="flex justify-between py-2 sm:py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm">Էլ. փոստ</span>
            <span className="font-medium text-slate-900 text-sm">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between py-2 sm:py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm">Հեռախոս</span>
            <span className="font-medium text-slate-900 text-sm">{user?.phone || '—'}</span>
          </div>
          <div className="flex justify-between py-2 sm:py-3 border-b border-slate-100">
            <span className="text-slate-500 text-sm">Դեր</span>
            <span className="font-medium text-slate-900 text-sm capitalize">{user?.role === 'admin' ? 'Ադմին' : user?.role || '—'}</span>
          </div>
          <div className="flex justify-between py-2 sm:py-3">
            <span className="text-slate-500 text-sm">Գրանցման ամսաթիվ</span>
            <span className="font-medium text-slate-900 text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('hy-AM') : '—'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
