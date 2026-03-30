'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CommentModal } from '../modals/CommentModal'

interface ReviewData {
  id: string
  rating: number
  comment: string
  [key: string]: unknown
}

interface ReviewForm {
  rating: number
  comment: string
}

interface CommentsTabProps {
  myReview?: ReviewData | null
  reviewForm?: ReviewForm
  isReviewSubmitting?: boolean
  onEditReview?: () => void
  onSubmitReviewUpdate?: (e: React.FormEvent) => void
  onSubmitReviewCreate?: (e: React.FormEvent) => void
  onReviewRatingChange?: (rating: number) => void
  onReviewCommentChange?: (comment: string) => void
}

export function CommentsTab({
  myReview,
  reviewForm = { rating: 5, comment: '' },
  isReviewSubmitting = false,
  onEditReview,
  onSubmitReviewUpdate,
  onSubmitReviewCreate,
  onReviewRatingChange,
  onReviewCommentChange
}: CommentsTabProps) {
  const handleRatingChange = (rating: number) => {
    onReviewRatingChange?.(rating)
  }

  const handleCommentChange = (comment: string) => {
    onReviewCommentChange?.(comment)
  }

  return (
    <motion.div
      key="comments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* My Review Section */}
      <Card className="shadow-xl rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Իմ մեկնաբանությունը</h3>
            {myReview && onEditReview && (
              <Button variant="outline" className="rounded-xl" onClick={onEditReview}>
                Թարմացնել
              </Button>
            )}
          </div>
          {myReview ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Գրված է</span>
              </div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`${i < myReview.rating ? 'text-yellow-500' : 'text-slate-300'} ${i < myReview.rating ? 'fa-solid' : 'fa-regular'} fa-star text-xl select-none`} />
                ))}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-quote-left text-slate-300 mt-1" />
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{myReview.comment}</p>
                </div>
              </div>
              {onSubmitReviewUpdate && (
                <form onSubmit={onSubmitReviewUpdate} className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const selected = idx < reviewForm.rating
                      return (
                        <button
                          key={`update-star-${idx}`}
                          type="button"
                          onClick={() => handleRatingChange(idx + 1)}
                          className="w-7 h-7 flex items-center justify-center"
                          aria-label={`Գնահատական ${idx + 1}`}
                        >
                          <i className={`${selected ? 'text-yellow-500' : 'text-slate-300'} ${selected ? 'fa-solid' : 'fa-regular'} fa-star text-2xl leading-none`} />
                        </button>
                      )
                    })}
                    <span className="text-[11px] font-bold text-slate-500 ml-2">({reviewForm.rating}/5)</span>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    rows={3}
                    placeholder="Թարմացնել մեկնաբանությունը"
                    maxLength={200}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-y"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isReviewSubmitting} className="rounded-xl bg-slate-900 hover:bg-slate-800">
                      {isReviewSubmitting ? 'Պահպանվում է…' : 'Պահպանել'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            onSubmitReviewCreate && (
              <form onSubmit={onSubmitReviewCreate} className="space-y-3">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={`edit-star-${idx}`}
                      type="button"
                      onClick={() => handleRatingChange(idx + 1)}
                      className="w-7 h-7 flex items-center justify-center"
                      aria-label={`Գնահատական ${idx + 1}`}
                    >
                      <i className={`${idx < reviewForm.rating ? 'text-yellow-500' : 'text-slate-300'} ${idx < reviewForm.rating ? 'fa-solid' : 'fa-regular'} fa-star text-2xl leading-none`} />
                    </button>
                  ))}
                  <span className="text-[11px] font-bold text-slate-500 ml-2">({reviewForm.rating}/5)</span>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  rows={3}
                  placeholder="Գրեք ձեր կարծիքը"
                  maxLength={200}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-y"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isReviewSubmitting} className="rounded-xl bg-slate-900 hover:bg-slate-800">
                    {isReviewSubmitting ? 'Պահպանվում է…' : 'Ավելացնել'}
                  </Button>
                </div>
              </form>
            )
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
