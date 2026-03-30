'use client'

import { Star } from 'lucide-react'
import type { Review } from './types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/30">
            {review.name?.charAt(0).toUpperCase() || 'Ո'}
          </div>
          <div>
            <p className="font-medium text-white text-sm">{review.name || 'Ուսանող'}</p>
            <p className="text-slate-500 text-xs">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('hy-AM') : 'Այսօր'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 transition-transform duration-300 group-hover:scale-105">
          <span className="text-white font-semibold text-sm">{review.rating || 5}.0</span>
          <Star className="w-4 h-4 fill-violet-500 text-violet-500" />
        </div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed transition-colors duration-300 group-hover:text-slate-200">
        {review.comment || 'Շատ հավանեցի դասընթացը! Մենթորը պրոֆեսիոնալ է և մատչելի բացատրում է ամեն ինչ։'}
      </p>
    </div>
  )
}
