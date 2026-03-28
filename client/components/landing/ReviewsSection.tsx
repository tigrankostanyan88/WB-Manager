'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const maxCount = Math.max(...[5, 4, 3, 2, 1].map(star => 
    reviews.filter(r => Math.round(r.rating || 5) === star).length
  ), 1)

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating || 5) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => Math.round(r.rating || 5) === star).length / reviews.length) * 100
      : 0,
    heightPercentage: (reviews.filter(r => Math.round(r.rating || 5) === star).length / maxCount) * 100
  }))

  // Group reviews into groups of 6 for 3x2 display (3 top, 3 bottom)
  const reviewGroups = []
  for (let i = 0; i < reviews.length; i += 6) {
    reviewGroups.push(reviews.slice(i, i + 6))
  }

  const totalSlides = Math.max(1, reviewGroups.length)

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
    <section id="reviews" className="w-full py-30 md:py-28 bg-[#0a0a0f] relative overflow-hidden">
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
          <div className="flex items-center gap-3 mb-20">
            <div className="h-1 w-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">ՈՒսանողների կարծիքները</h2>
          </div>

          {/* Rating Overview Card */}
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

          {/* Review Cards Slider - 3x2 Grid */}
          <div className="relative">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {reviewGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="min-w-full px-1 mt-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {group.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {reviewGroups.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-violet-500' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={prevSlide}
                    className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-105"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg shadow-violet-900/30"
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

function ReviewCard({ review }: { review: Review }) {
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
