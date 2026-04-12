'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Users, ArrowRight, BookOpen, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '../types'
import { useVideoThumbnail } from '../hooks/useVideoThumbnail'
import { calculatePriceInfo } from '../types'

interface CourseCardProps {
  course: Course
  index: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  const { displayPrice, originalPrice, discount } = calculatePriceInfo(course.price, course.discount)
  const { thumbnail, loading: thumbnailLoading } = useVideoThumbnail(course)
  const imageSrc = thumbnail || '/images/no-image.png'

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-violet-300 h-full flex flex-col">
      <Link href={`/course-details/${course.id}`} prefetch={true} className="h-full flex flex-col">
        {/* Thumbnail Container */}
        <div className="relative h-48 sm:h-56 md:h-60 lg:h-64 overflow-hidden bg-slate-100">
          {thumbnailLoading ? (
            <div className="w-full h-full bg-slate-200 animate-pulse" />
          ) : (
            <Image
              src={imageSrc}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading={index < 3 ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          {course.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold rounded-full shadow-sm">
                {course.category}
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                -{discount}%
              </span>
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 lg:p-7 flex flex-col flex-grow">
          {/* Rating & Students */}
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                {course.rating ? course.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs sm:text-sm text-slate-400">
                ({course.reviewsCount || 0} կարծիք)
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">{course.studentsCount || 0} ուսանող</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-violet-700 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-5 line-clamp-2 flex-grow leading-relaxed">
            {course.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-4 sm:mb-5">
            <div className="flex items-center gap-1 bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium">{course.duration || '6 ժամ'}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium">{course.language === 'ARM' ? 'Հայերեն' : course.language || 'Հայերեն'}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 sm:pt-5 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold text-violet-600">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm"
            >
              Դիտել
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
