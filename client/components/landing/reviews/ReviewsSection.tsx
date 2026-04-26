'use client'

import { useEffect, useState, useMemo } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { RatingOverview } from './RatingOverview'
import { ReviewsSlider } from './ReviewsSlider'
import type { Review, RatingCount } from './types'

function calculateStats(reviews: Review[]) {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0'

  const maxCount = Math.max(...[5, 4, 3, 2, 1].map(star => 
    reviews.filter(r => Math.round(r.rating || 5) === star).length
  ), 1)

  const ratingCounts: RatingCount[] = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating || 5) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => Math.round(r.rating || 5) === star).length / reviews.length) * 100
      : 0,
    heightPercentage: (reviews.filter(r => Math.round(r.rating || 5) === star).length / maxCount) * 100
  }))

  return { averageRating, ratingCounts }
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsRes = await api.get('/api/v1/reviews')
        const responseData = reviewsRes.data?.data as { reviews?: Review[] }
        const list = Array.isArray(responseData?.reviews) ? responseData.reviews : []
        setReviews(list)
      } catch {
        // Fail silently - reviews are optional
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const { averageRating, ratingCounts } = useMemo(() => calculateStats(reviews), [reviews])
  const reduceMotion = useReducedMotion()

  // Animation props
  const fadeInUp = {
    initial: { opacity: 1, y: 0 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: reduceMotion ? undefined : { once: true, amount: 0.3 }
  }

  if (isLoading) {
    return (
      <section id="reviews" className="w-full py-20 md:py-28 bg-[#0a0a0f]">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-500 border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="w-full py-20 md:py-28 bg-[#0a0a0f]">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Մեր կարծիքները</h2>
            <p className="text-slate-400">Դեռ չկան կարծիքներ</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews" className="w-full py-30 md:py-28 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          {...fadeInUp}
          className="w-full"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-20">
            <div className="h-1 w-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">ՈՒսանողների կարծիքները</h2>
          </div>

          <RatingOverview 
            reviews={reviews} 
            averageRating={averageRating} 
            ratingCounts={ratingCounts} 
          />

          <ReviewsSlider 
            reviews={reviews} 
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
          />
        </motion.div>
      </div>
    </section>
  )
}
