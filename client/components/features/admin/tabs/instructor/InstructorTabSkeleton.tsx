'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function InstructorTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-w-xl">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  )
}
