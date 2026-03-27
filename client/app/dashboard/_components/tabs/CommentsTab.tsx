'use client'

import { Trash2 } from 'lucide-react'
import type { Review } from '../../_types'

interface CommentsTabProps {
  reviews: Review[]
  isReviewsLoading: boolean
  relativeTime: (date: string) => string
  isToday: (date: string) => boolean
  onDeleteReview: (id: string) => void
}

export default function CommentsTab({
  reviews,
  isReviewsLoading,
  relativeTime,
  onDeleteReview
}: CommentsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Մեկնաբանություններ</h2>

      {isReviewsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map((review, index) => (
            <div key={review._id || `review-${index}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <span className="text-sm text-slate-400">{relativeTime(review.createdAt)}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 mt-2">{review.comment}</p>
                </div>
                <button
                  onClick={() => onDeleteReview(review._id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Մեկնաբանություններ չկան</p>
      )}
    </div>
  )
}
