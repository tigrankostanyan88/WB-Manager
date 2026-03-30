'use client'

import { Star } from 'lucide-react'
import type { Review, RatingCount, CategoryRating } from './types'

interface RatingOverviewProps {
  reviews: Review[]
  averageRating: string
  ratingCounts: RatingCount[]
}

export function RatingOverview({ reviews, averageRating, ratingCounts }: RatingOverviewProps) {
  const categories: CategoryRating[] = [
    { name: 'Ուսուցման որակ', rating: parseFloat(averageRating) },
    { name: 'Մենթորի աջակցություն', rating: Math.min(5, parseFloat(averageRating) + 0.2) },
    { name: 'Հարմարություն', rating: Math.min(5, parseFloat(averageRating) + 0.1) },
    { name: 'Նյութերի մատչելիություն', rating: parseFloat(averageRating) },
    { name: 'Արդյունավետություն', rating: Math.min(5, parseFloat(averageRating) + 0.3) },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-6 md:p-10 mb-10 shadow-2xl shadow-violet-900/10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        {/* Left - Overall Rating & Chart */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="text-center sm:text-left">
            <div className="text-5xl sm:text-6xl font-black text-white mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text">{averageRating}</div>
            <div className="flex gap-1 mb-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-violet-500 text-violet-500' : 'text-slate-600'}`}
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm font-medium">{reviews.length} կարծիք</p>
          </div>

          {/* Rating Distribution Chart */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-end gap-1.5 sm:gap-2 h-20 sm:h-24">
              {ratingCounts.map(({ star, count, heightPercentage }) => (
                <div key={star} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg transition-all duration-700 ease-out min-h-[4px]"
                      style={{ height: `${Math.max(heightPercentage * 0.8, 4)}px` }}
                    />
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-slate-400 text-xs font-medium">{star}</span>
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-violet-400 fill-violet-400" />
                  </div>
                  <span className="text-slate-500 text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle - Rating Bars List */}
        <div className="flex flex-col justify-center order-last lg:order-none">
          <div className="space-y-2 sm:space-y-3">
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 group">
                <div className="flex items-center gap-1.5 w-10 sm:w-12">
                  <span className="text-slate-300 text-sm font-medium">{star}</span>
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400 fill-violet-400" />
                </div>
                <div className="flex-1 h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500 group-hover:from-violet-500 group-hover:to-violet-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-6 sm:w-8 text-right font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Category Ratings */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 hover:border-violet-500/30 transition-colors"
              >
                <span className="text-violet-400 font-bold text-xs sm:text-sm">{cat.rating.toFixed(1)}</span>
                <span className="text-slate-300 text-xs sm:text-sm">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
