'use client'

import { Award, Star, TrendingUp } from 'lucide-react'
import type { Review } from './types'

interface HeroWidgetsProps {
  latestReviews: Review[]
}

export function HeroWidgets({ latestReviews }: HeroWidgetsProps) {
  const averageRating = latestReviews.length > 0
    ? (latestReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / latestReviews.length).toFixed(1)
    : '0.0'

  return (
    <>
      {/* Reviews Widget - Bottom Left */}
      <div className="absolute -bottom-4 -left-4 hidden lg:flex items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-violet-200/30 ring-1 ring-white/50 transform rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-all duration-500 z-20">
        {/* Overlapping Avatars */}
        <div className="flex -space-x-3">
          {(latestReviews.length > 0 ? latestReviews.slice(0, 3) : [1, 2, 3]).map((review, idx) => (
            <div 
              key={typeof review === 'object' ? review.id || idx : idx}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white overflow-hidden shadow-lg"
            >
              {typeof review === 'object' 
                ? review.name?.charAt(0).toUpperCase() 
                : String.fromCharCode(65 + idx)}
            </div>
          ))}
        </div>
        
        {/* Rating & Count */}
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-base font-bold text-slate-900">{averageRating}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {latestReviews.length > 0 ? `${latestReviews.length} կարծիք` : '0 կարծիք'}
          </span>
        </div>
      </div>

      {/* Growth Widget - Top Right */}
      <div className="absolute -top-4 -right-4 hidden lg:flex flex-col gap-2 p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-violet-200/30 ring-1 ring-white/50 transform rotate-[6deg] hover:rotate-0 hover:scale-110 transition-all duration-500 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:scale-110 hover:rotate-3 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ամսական աճ</p>
            <p className="text-xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">+340%</p>
          </div>
        </div>
      </div>

      {/* Certificate Widget - Bottom Right */}
      <div className="absolute -bottom-8 right-8 hidden lg:flex items-center gap-3 p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-2xl shadow-violet-500/30 transform rotate-[3deg] hover:rotate-0 hover:scale-105 transition-all duration-500 z-20">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
          <Award className="w-5 h-5" />
        </div>
        <div className="text-white pr-2">
          <p className="text-[10px] opacity-90">Վստահելի</p>
          <p className="text-sm font-bold">Վկայական</p>
        </div>
      </div>
    </>
  )
}
