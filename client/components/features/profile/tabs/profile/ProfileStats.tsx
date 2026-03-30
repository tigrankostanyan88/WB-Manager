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
  { label: 'Ընթացիկ դասեր', key: 'currentLessons', default: '0/0', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-100' },
  { label: 'Միավորներ', key: 'points', default: '0', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100', format: (v: number) => v?.toLocaleString() },
  { label: 'Սերտիֆիկատ', key: 'certificates', default: 'Տրվում է', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
  { label: 'Գրանցված եմ', key: 'coursesCount', default: '0 դասընթաց', icon: BookOpenCheck, color: 'text-pink-600', bg: 'bg-pink-50', borderColor: 'border-pink-100', format: (v: number) => `${v} դասընթաց` },
]

export function ProfileStats({ stats, coursesCount, isLoading }: ProfileStatsProps) {
  const getValue = (stat: StatConfig): string => {
    if (stat.key === 'coursesCount') {
      return stat.format?.(coursesCount) ?? `${coursesCount} դասընթաց`
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
            whileHover={{ y: -4, scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Card className={`${stat.bg} ${stat.borderColor} border-2 shadow-sm rounded-2xl overflow-hidden group-hover:shadow-lg transition-all duration-300 h-full`}>
              {isLoading ? (
                <CardContent className="p-5 flex items-center gap-3.5 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-white/50" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-12 bg-white/50 rounded" />
                    <div className="h-3 w-10 bg-white/50 rounded" />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-5 flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} border border-white`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
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
