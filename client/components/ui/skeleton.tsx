'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-800',
        className
      )}
    />
  )
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100 p-6', className)}>
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4', i === 0 ? 'w-1/3' : 'flex-1')} />
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

export function CourseRegistrationRowSkeleton() {
  return (
    <tr className="border-b border-slate-50">
      <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-16 rounded-full mx-auto" /></td>
      <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
    </tr>
  )
}

export function CourseRegistrationTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Անուն</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Հեռախոս</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Դասընթաց</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ամսաթիվ</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Կարգավիճակ</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Գործողություն</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <CourseRegistrationRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
