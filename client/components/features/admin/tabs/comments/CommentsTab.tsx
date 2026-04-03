'use client'

import { Trash2, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { getUserAvatarUrl } from '@/lib/utils/avatar'
import type { Review } from '@/components/features/admin/types'

interface CommentsTabProps {
  reviews: Review[]
  isReviewsLoading: boolean
  relativeTime: (date: string) => string
  onDeleteReview: (id: string | number) => void
}

export function CommentsTab({
  reviews,
  isReviewsLoading,
  relativeTime,
  onDeleteReview
}: CommentsTabProps) {
  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 pb-4 mb-2">
        <h2 className="text-xl font-semibold text-slate-900">Մեկնաբանություններ</h2>
      </div>

      {isReviewsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {reviews.map((review, index) => {
            const avatarUrl = getUserAvatarUrl(review.user)
            return (
              <div key={review._id || review.id || `review-${index}`} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={review.name || 'User'}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 text-lg leading-tight">{review.name}</p>
                          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {relativeTime(review.createdAt || '')}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mt-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-base ${i < (review.rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onDeleteReview(review._id || review.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Ջնջել"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mt-3 relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-violet-100 rounded-full" />
                      <p className="text-slate-600 leading-relaxed pl-2 italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Մեկնաբանություններ չկան</p>
          <p className="text-slate-400 text-sm mt-1">Դեռ ոչ մի մեկնաբանություն չի գրանցվել</p>
        </div>
      )}
    </div>
  )
}
