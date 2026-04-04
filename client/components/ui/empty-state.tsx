'use client'

import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Inbox,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 text-center">
        {title}
      </h3>
      {description && (
        <p className="text-slate-500 text-center mt-2 max-w-md">
          {description}
        </p>
      )}
    </div>
  )
}
