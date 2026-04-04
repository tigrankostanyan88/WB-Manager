'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { DashboardTabId } from './types'
import type { LucideIcon } from 'lucide-react'

export interface DashboardMenuItem {
  id: DashboardTabId
  label: string
  icon: LucideIcon
}

interface DashboardSidebarProps {
  menuItems: DashboardMenuItem[]
  activeTab: DashboardTabId
  onTabChange: (tab: DashboardTabId) => void
  badges?: Partial<Record<DashboardTabId, number>>
}

export function DashboardSidebar({ menuItems, activeTab, onTabChange, badges }: DashboardSidebarProps) {
  return (
    <aside className="lg:w-72 flex-shrink-0" aria-label="Dashboard navigation">
      <div className="sticky top-40 space-y-6">
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
          <nav className="space-y-2" role="tablist" aria-label="Dashboard tabs">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id
              const badgeCount = badges?.[item.id] ?? 0
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label}${badgeCount > 0 ? `, ${badgeCount} չկարդացված` : ''}`}
                  className={cn(
                    'relative w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-black transition-colors duration-300',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <item.icon className={cn('relative z-10 w-5 h-5 transition-colors duration-300', isActive ? 'text-white' : 'text-slate-400')} aria-hidden="true" />
                  <span className="relative z-10">{item.label}</span>
                  {badgeCount > 0 && (
                    <span 
                      className="relative z-10 ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none"
                      aria-label={`${badgeCount} չկարդացված`}
                    >
                      {badgeCount >= 10 ? '9+' : badgeCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}

