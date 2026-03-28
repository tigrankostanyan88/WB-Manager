'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
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
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate statistics
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0'

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating || 5) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => Math.round(r.rating || 5) === star).length / reviews.length) * 100
      : 0
  }))

  // Group reviews into pairs for 2x2 display
  const reviewPairs = []
  for (let i = 0; i < reviews.length; i += 2) {
    reviewPairs.push(reviews.slice(i, i + 2))
  }

  const totalSlides = Math.max(1, reviewPairs.length)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Category ratings
  const categories = [
    { name: 'Ուսուցման որակ', rating: parseFloat(averageRating) },
    { name: 'Մենթորի աջակցություն', rating: Math.min(5, parseFloat(averageRating) + 0.2) },
    { name: 'Հարմարություն', rating: Math.min(5, parseFloat(averageRating) + 0.1) },
    { name: 'Նյութերի մատչելիություն', rating: parseFloat(averageRating) },
    { name: 'Արդյունավետություն', rating: Math.min(5, parseFloat(averageRating) + 0.3) },
  ]

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
    <section id="reviews" className="w-full py-20 md:py-28 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Մեր կարծիքները</h2>

          {/* Rating Overview Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left - Overall Rating */}
              <div className="flex items-start gap-6">
                <div>
                  <div className="text-5xl font-bold text-white mb-1">{averageRating}</div>
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-violet-500 text-violet-500' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 text-sm">{reviews.length} կարծիք</p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-1.5">
                  {ratingCounts.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm w-3">{star}</span>
                      <Star className="w-3 h-3 text-slate-500" />
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-sm w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Category Ratings */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700"
                    >
                      <span className="text-violet-400 font-semibold text-sm">{cat.rating.toFixed(1)}</span>
                      <span className="text-slate-300 text-sm">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Review Cards Slider */}
          <div className="relative">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {reviewPairs[currentSlide]?.map((review) => (
                    <div
                      key={review.id}
                      className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-5 md:p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {review.name?.charAt(0).toUpperCase() || 'Ո'}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{review.name || 'Ուսանող'}</p>
                            <p className="text-slate-500 text-xs">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('hy-AM') : 'Այսօր'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white font-semibold text-sm">{review.rating || 5}.0</span>
                          <Star className="w-4 h-4 fill-violet-500 text-violet-500" />
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed">
                        {review.comment || 'Շատ հավանեցի դասընթացը! Մենթորը պրոֆեսիոնալ է և մատչելի բացատրում է ամեն ինչ։'}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-1.5">
                  {reviewPairs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-violet-500' : 'w-1.5 bg-slate-600 hover:bg-slate-500'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
