'use client'

import { Skeleton, StatCardSkeleton, ListSkeleton } from '@/components/ui/skeleton'

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          <ListSkeleton count={5} />
        </div>
      </div>
    </div>
  )
}
