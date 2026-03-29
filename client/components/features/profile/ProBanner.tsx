'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle, Lock, Trophy } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  course_id?: string
  course?: {
    id?: string
    title: string
    image?: string
  }
  createdAt?: string
}

interface ProBannerProps {
  user?: { 
    role?: string 
    name?: string
    course_ids?: (string | number)[]
    courseIds?: (string | number)[]
  }
  myPayments?: Payment[]
  totalCoursesCount?: number
  onShowPaymentModal: () => void
}

export default function ProBanner({ user, myPayments = [], totalCoursesCount = 0, onShowPaymentModal }: ProBannerProps) {
  const successfulPayments = myPayments.filter(p => p.status === 'success')
  const pendingPayments = myPayments.filter(p => p.status === 'pending')
  const failedPayments = myPayments.filter(p => p.status === 'failed')

  const totalCourses = myPayments.length

  // Check if user has paid for ALL available courses
  const allCoursesPaid = totalCoursesCount > 0 && successfulPayments.length === totalCoursesCount

  // If no courses at all (no payments)
  if (totalCourses === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Դասընթացներ չկան</h3>
            <p className="text-sm text-slate-400">Դուք դեռ չեք գնել որևէ դասընթաց</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Welcome Message - Show when user has registered courses */}
      {successfulPayments.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Դուք ունեք գրանցված դասընթացներ!</h3>
              <p className="text-sm text-white/80">Մաղթում ենք հաջող ուսման ընթացք</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Իմ դասընթացները</h3>
          <p className="text-sm text-slate-500">
            {successfulPayments.length} ակտիվ • {pendingPayments.length} սպասում • {failedPayments.length} սխալ
          </p>
        </div>
      </div>

      {/* Course Status Cards */}
      <div className="grid gap-3">
        {/* Active/Paid Courses */}
        {successfulPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center gap-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-bold text-slate-900">
                {payment.course?.title || 'Դասընթաց'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{payment.amount?.toLocaleString()} դրամ</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Վճարված</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              ԱԿՏԻՎ
            </span>
          </div>
        ))}

        {/* Pending Courses */}
        {pendingPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center gap-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-bold text-slate-900">
                {payment.course?.title || 'Դասընթաց'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{payment.amount?.toLocaleString()} դրամ</span>
                <span>•</span>
                <span className="text-yellow-600 font-medium">Սպասվում է հաստատման</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
              ՍՊԱՍՈՒՄ
            </span>
          </div>
        ))}

        {/* Failed Courses */}
        {failedPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center gap-4 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-bold text-slate-900">
                {payment.course?.title || 'Դասընթաց'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{payment.amount?.toLocaleString()} դրամ</span>
                <span>•</span>
                <span className="text-red-600 font-medium">Չհաստատվեց</span>
              </div>
            </div>
            <Button
              onClick={onShowPaymentModal}
              size="sm"
              className="h-8 shrink-0 rounded-lg bg-red-500 px-3 text-xs font-bold text-white hover:bg-red-600"
            >
              Կրկնել
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
