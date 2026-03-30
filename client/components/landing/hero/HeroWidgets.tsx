'use client'

import { Star, TrendingUp } from 'lucide-react'
import type { Review } from './types'

interface HeroWidgetsProps {
  latestReviews: Review[]
}

export function HeroWidgets({ latestReviews }: HeroWidgetsProps) {
  const averageRating = latestReviews.length > 0
    ? (latestReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / latestReviews.length).toFixed(1)
    : '5.0'

  return (
    <>
      {/* Reviews Widget - Bottom Left */}
      {latestReviews.length > 0 && (
        <div className="absolute -bottom-3 -left-3 rotate-[5deg] hidden lg:flex items-center gap-3 p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transform transition-transform duration-500 hover:scale-105">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-2">
            {latestReviews.slice(0, 3).map((review, idx) => (
              <div 
                key={review.id || idx}
                className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white overflow-hidden"
              >
                {review.name?.charAt(0).toUpperCase() || 'Ո'}
              </div>
            ))}
          </div>
          
          {/* Rating & Count */}
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900">{averageRating}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {latestReviews.length}+ կարծիք
            </span>
          </div>
        </div>
      )}

      {/* Growth Widget - Top Right */}
      <div className="absolute -top-6 -right-6 hidden lg:flex flex-col gap-2 p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-110">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Ամսական աճ</p>
            <p className="text-lg font-bold text-slate-900">+340%</p>
          </div>
        </div>
      </div>
    </>
  )
}
