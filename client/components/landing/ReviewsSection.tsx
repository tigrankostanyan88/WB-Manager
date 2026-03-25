'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/v1/reviews')
        const payload = res.data as { reviews?: Review[]; data?: Review[] }
        let list: Review[] = []
        if (Array.isArray(payload.reviews)) {
          list = payload.reviews
        } else if (Array.isArray(payload.data)) {
          list = payload.data
        }
        setReviews(list.slice(0, 9))
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, reviews.length - 2)) % Math.max(1, reviews.length - 2))
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0'

  const renderStars = (rating: number = 5) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <section id="reviews" className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section id="reviews" className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-40" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Star className="w-4 h-4 fill-current" />
            {averageRating}/5 միջին գնահատական
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Ուսանողների կարծիքները
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Մեր ուսանողների իրական կարծիքները՝ նրանց հաջողության պատմություններից
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 h-full flex flex-col hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-200 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-700 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          {review.name?.charAt(0).toUpperCase() || 'Ո'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {review.name || 'Ուսանող'}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('hy-AM') : ''}
                          </p>
                        </div>
                      </div>
                      <Quote className="w-8 h-8 text-violet-100 fill-current" />
                    </div>

                    {renderStars(review.rating)}

                    <p className="text-slate-600 text-sm leading-relaxed mt-4 flex-1">
                      "{review.comment || 'Շատ հավանեցի դասընթացը!'}$"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg border-slate-200 hover:bg-violet-50 hover:border-violet-200 hidden lg:flex"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg border-slate-200 hover:bg-violet-50 hover:border-violet-200 hidden lg:flex"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </Button>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.slice(0, Math.max(1, reviews.length - 2)).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-violet-600' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-4 shadow-sm border border-slate-100">
            <div className="text-center">
              <p className="text-3xl font-black text-violet-600">{reviews.length}+</p>
              <p className="text-sm text-slate-500">Կարծիքներ</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-black text-amber-500">{averageRating}</p>
              <p className="text-sm text-slate-500">Միջին գնահատական</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-500">98%</p>
              <p className="text-sm text-slate-500">Դրական կարծիքներ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
