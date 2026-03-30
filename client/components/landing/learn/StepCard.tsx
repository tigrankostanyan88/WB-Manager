'use client'

import { cn } from '@/lib/utils'
import type { LearnStep } from './utils'

interface StepCardProps {
  step: LearnStep
  index: number
  isLast: boolean
}

const COLOR_CLASSES: Record<string, { bg: string; shadow: string }> = {
  violet: { bg: 'bg-violet-500', shadow: 'shadow-violet-300/50' },
  blue: { bg: 'bg-blue-500', shadow: 'shadow-blue-300/50' },
  orange: { bg: 'bg-orange-500', shadow: 'shadow-orange-300/50' },
  pink: { bg: 'bg-pink-500', shadow: 'shadow-pink-300/50' },
  slate: { bg: 'bg-slate-500', shadow: 'shadow-slate-300/50' },
}

const GRID_POSITIONS: Record<number, string> = {
  1: 'lg:mt-12',
  2: 'lg:col-start-1 lg:row-start-2 lg:-mt-12',
  3: 'lg:col-start-2 lg:row-start-2',
}

export function StepCard({ step, index, isLast }: StepCardProps) {
  const colors = COLOR_CLASSES[step.color] || COLOR_CLASSES.slate
  const positionClass = GRID_POSITIONS[index] || ''

  return (
    <div className={cn('relative group', positionClass)}>
      <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative z-10 transition-transform hover:-translate-y-1 duration-300">
        <div
          className={cn(
            'absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg rotate-[-6deg] group-hover:rotate-0 transition-transform ring-2 ring-white z-30',
            colors.bg,
            colors.shadow
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
