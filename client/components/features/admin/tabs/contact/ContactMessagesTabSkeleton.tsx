'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ContactMessagesTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      
      {/* Messages List */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  {i < 2 && <Skeleton className="h-5 w-16 rounded-full bg-red-100" />}
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2 ml-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
