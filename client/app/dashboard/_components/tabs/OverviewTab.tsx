'use client'

import { LucideIcon } from 'lucide-react'

interface OverviewTabProps {
  stats: Array<{
    label: string
    value: string
    icon: LucideIcon
    trend: string
    color: string
    bg: string
  }>
  recentStudents: any[]
  isRecentLoading: boolean
  relativeTime: (date: string) => string
}

export default function OverviewTab({ stats, recentStudents, isRecentLoading, relativeTime }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Վիճակագրություն</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Վերջին գրանցումները</h3>
        </div>
        <div className="p-6">
          {isRecentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
            </div>
          ) : recentStudents.length > 0 ? (
            <div className="space-y-4">
              {recentStudents.map((student: any) => (
                <div key={student._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                  <span className="text-sm text-slate-400">{relativeTime(student.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Գրանցումներ չկան</p>
          )}
        </div>
      </div>
    </div>
  )
}
