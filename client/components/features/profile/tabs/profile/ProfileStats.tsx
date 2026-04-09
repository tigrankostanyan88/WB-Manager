'use client'

import { motion } from 'framer-motion'
import { Clock, Trophy, Award, BookOpenCheck, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { StatsData } from './utils'

interface ProfileStatsProps {
  stats: StatsData | null
  coursesCount: number
  isLoading: boolean
}

interface StatConfig {
  label: string
  key: string
  default: string
  icon: LucideIcon
  color: string
  bg: string
  borderColor: string
  format?: (v: number) => string
}

const STAT_CONFIG: StatConfig[] = [
  { label: 'Ընթացիկ դասեր', key: 'currentLessons', default: '0/0', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-200' },
  { label: 'Միավորներ', key: 'points', default: '0', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-200', format: (v: number) => v?.toLocaleString() },
  { label: 'Սերտիֆիկատ', key: 'certificates', default: 'Տրվում է', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { label: 'Դասընթացներ', key: 'coursesCount', default: '0', icon: BookOpenCheck, color: 'text-violet-600', bg: 'bg-violet-50', borderColor: 'border-violet-200' },
]

export function ProfileStats({ stats, coursesCount, isLoading }: ProfileStatsProps) {
  const getValue = (stat: StatConfig): string => {
    if (stat.key === 'coursesCount') {
      return String(coursesCount)
    }
    const statValue = stats?.[stat.key as keyof StatsData]
    if (typeof statValue === 'number') {
      return stat.format?.(statValue) ?? String(statValue)
    }
    if (typeof statValue === 'string') {
      return statValue
    }
    return stat.default
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STAT_CONFIG.map((stat, i) => {
        const value = getValue(stat)

        return (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group"
          >
            <Card className={`bg-white ${stat.borderColor} border shadow-md rounded-2xl overflow-hidden group-hover:shadow-xl group-hover:shadow-${stat.bg.split('-')[1]}-200/50 transition-all duration-300 h-full`}>
              {isLoading ? (
                <CardContent className="p-6 flex items-center gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                    <div className="h-4 w-12 bg-slate-100 rounded" />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{value}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
