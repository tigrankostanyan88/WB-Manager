import api from '@/lib/api'
import type { FormEvent } from 'react'
import { useState } from 'react'

interface ReviewForm {
  rating: number
  comment: string
}

interface ReviewData {
  id: string
  rating: number
  comment: string
  [key: string]: unknown
}

interface UseReviewsParams {
  myReview: ReviewData | null
  setMyReview: (r: ReviewData | null) => void
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useReviews({ myReview, setMyReview, showToast }: UseReviewsParams) {
  const [reviewForm, setReviewForm] = useState<ReviewForm>({ rating: 5, comment: '' })
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)

  const handleEditReview = () => {
    if (!myReview) return
    setReviewForm({ rating: myReview.rating, comment: myReview.comment })
  }

  const extractErrorMessage = (err: unknown): string | null => {
    if (!err || typeof err !== 'object') return null
    const resp = (err as { response?: unknown }).response
    if (!resp || typeof resp !== 'object') return null
    const data = (resp as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    const msg = (data as { message?: unknown }).message
    return typeof msg === 'string' ? msg : null
  }

  const handleSubmitReviewUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!myReview) return
    setIsReviewSubmitting(true)
    try {
      const c = reviewForm.comment.trim()
      if (!c) throw new Error('Մեկնաբանությունը պարտադիր է')
      if (c.length > 200) throw new Error('Մեկնաբանությունը պետք է լինի առավելագույնը 200 նիշ')
      await api.put(`/api/v1/reviews/${myReview.id}`, { rating: reviewForm.rating, comment: reviewForm.comment })
      const res = await api.get('/api/v1/reviews/me')
      setMyReview(((res.data as { data?: { review?: unknown }; review?: unknown })?.data?.review || (res.data as { review?: unknown })?.review || null) as ReviewData | null)
      setReviewForm({ rating: 5, comment: '' })
      showToast('Մեկնաբանությունը թարմացվեց')
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || (err instanceof Error ? err.message : null) || 'Սխալ մեկնաբանության թարմացման ժամանակ'
      showToast(msg, 'error')
    } finally {
      setIsReviewSubmitting(false)
    }
  }

  const handleSubmitReviewCreate = async (e: FormEvent) => {
    e.preventDefault()
    setIsReviewSubmitting(true)
    try {
      const c = reviewForm.comment.trim()
      if (!c) throw new Error('Մեկնաբանությունը պարտադիր է')
      if (c.length > 200) throw new Error('Մեկնաբանությունը պետք է լինի առավելագույնը 200 նիշ')
      await api.post('/api/v1/reviews', { rating: reviewForm.rating, comment: reviewForm.comment })
      const res = await api.get('/api/v1/reviews/me')
      setMyReview(((res.data as { data?: { review?: unknown }; review?: unknown })?.data?.review || (res.data as { review?: unknown })?.review || null) as ReviewData | null)
      setReviewForm({ rating: 5, comment: '' })
      showToast('Մեկնաբանությունը ավելացվեց')
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || (err instanceof Error ? err.message : null) || 'Սխալ մեկնաբանություն ավելացնելիս'
      showToast(msg, 'error')
    } finally {
      setIsReviewSubmitting(false)
    }
  }

  return { reviewForm, setReviewForm, isReviewSubmitting, handleEditReview, handleSubmitReviewUpdate, handleSubmitReviewCreate }
}
