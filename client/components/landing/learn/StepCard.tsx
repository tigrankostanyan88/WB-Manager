'use client'

import { cn } from '@/lib/utils'
import type { LearnStep } from './utils'

interface StepCardProps {
  step: LearnStep
  index: number
  isLast: boolean
}

const CARD_BG_CLASSES: Record<string, string> = {
  violet: 'bg-gradient-to-br from-violet-50/80 to-violet-100/60',
  blue: 'bg-gradient-to-br from-blue-50/80 to-blue-100/60',
  orange: 'bg-gradient-to-br from-orange-50/80 to-orange-100/60',
  pink: 'bg-gradient-to-br from-pink-50/80 to-pink-100/60',
  slate: 'bg-gradient-to-br from-slate-50/80 to-slate-100/60',
}

const BADGE_BG_CLASSES: Record<string, string> = {
  violet: 'bg-violet-500 shadow-violet-300/50',
  blue: 'bg-blue-500 shadow-blue-300/50',
  orange: 'bg-orange-500 shadow-orange-300/50',
  pink: 'bg-pink-500 shadow-pink-300/50',
  slate: 'bg-slate-500 shadow-slate-300/50',
}

const GRID_POSITIONS: Record<number, string> = {
  1: 'lg:mt-12',
  2: 'lg:col-start-1 lg:row-start-2 lg:-mt-12',
  3: 'lg:col-start-2 lg:row-start-2',
}

export function StepCard({ step, index, isLast }: StepCardProps) {
  const cardBg = CARD_BG_CLASSES[step.color] || CARD_BG_CLASSES.slate
  const badgeClasses = BADGE_BG_CLASSES[step.color] || BADGE_BG_CLASSES.slate
  const positionClass = GRID_POSITIONS[index] || ''

  return (
    <div className={cn('relative group', positionClass)}>
      <div className={cn('rounded-[2rem] p-5 sm:p-6 shadow-xl shadow-slate-200/50 border border-white/80 backdrop-blur-sm relative z-10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 duration-300', cardBg)}>
        <div
          className={cn(
            'absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg rotate-[-6deg] group-hover:rotate-0 transition-transform ring-2 ring-white z-30',
            badgeClasses
          )}
        >
          {step.number}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 mb-2">{step.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
      </div>
      {isLast && (
        <div className="lg:hidden flex justify-center py-4">
          <div className="w-0.5 h-8 bg-slate-200" />
        </div>
      )}
    </div>
  )
}
