'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SettingsTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-32" />
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
        {/* Logo Section */}
        <div>
          <Skeleton className="h-5 w-24 mb-4" />
          <Skeleton className="w-32 h-32 rounded-xl" />
        </div>

        {/* Site Name */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        </div>

        {/* Working Hours */}
        <div>
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="border border-slate-100 rounded-lg p-3">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  )
}
