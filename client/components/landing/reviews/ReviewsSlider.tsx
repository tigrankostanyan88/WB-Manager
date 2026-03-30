'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReviewCard } from './ReviewCard'
import type { Review } from './types'

interface ReviewsSliderProps {
  reviews: Review[]
  currentSlide: number
  onSlideChange: (index: number) => void
}

export function ReviewsSlider({ reviews, currentSlide, onSlideChange }: ReviewsSliderProps) {
  // Group reviews into groups of 6 for 3x2 display
  const reviewGroups: Review[][] = []
  for (let i = 0; i < reviews.length; i += 6) {
    reviewGroups.push(reviews.slice(i, i + 6))
  }

  const totalSlides = Math.max(1, reviewGroups.length)

  const nextSlide = () => {
    onSlideChange((currentSlide + 1) % totalSlides)
  }

  const prevSlide = () => {
    onSlideChange((currentSlide - 1 + totalSlides) % totalSlides)
  }

  if (reviewGroups.length === 0) return null

  return (
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
                onClick={() => onSlideChange(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-violet-500' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-105"
              aria-label="Նախորդ հարցում"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg shadow-violet-900/30"
              aria-label="Հաջորդ հարցում"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
