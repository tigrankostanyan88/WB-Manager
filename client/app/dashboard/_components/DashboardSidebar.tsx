'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DashboardMenuItem {
  id: string
  label: string
  icon: LucideIcon
}

interface DashboardSidebarProps {
  menuItems: DashboardMenuItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function DashboardSidebar({ menuItems, activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
      <nav className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeTab
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-violet-600' : 'text-slate-400')} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
