'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Users, ArrowRight, BookOpen, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { Course } from '../types'
import { useVideoThumbnail } from '../hooks/useVideoThumbnail'
import { calculatePriceInfo } from '../types'

interface CourseCardProps {
  course: Course
  index: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  const { thumbnail, loading: thumbnailLoading } = useVideoThumbnail(course)
  const { displayPrice, originalPrice, discount } = calculatePriceInfo(course.price, course.discount)

  const imageSrc = thumbnail || course.imageUrl || '/images/no-image.png'
  const showFallback = !thumbnail && !course.imageUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/course-details/${course.id}`} prefetch={true}>
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-violet-200 h-full flex flex-col">
          {/* Thumbnail Container */}
          <div className="relative h-48 overflow-hidden bg-slate-900">
            {thumbnailLoading ? (
              <div className="w-full h-full bg-slate-800 animate-pulse" />
            ) : (
              <Image
                src={showFallback ? '/images/no-image.png' : imageSrc}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            {course.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full">
                  {course.category}
                </span>
              </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
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
          <div className="p-5 flex flex-col flex-grow">
            {/* Rating & Students */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-slate-700">
                  {course.rating?.toFixed(1) || '4.9'}
                </span>
                <span className="text-sm text-slate-400">
                  ({course.reviewsCount || 0})
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{course.studentsCount || 0}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration || '6 ժամ'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.language === 'ARM' ? 'Հայերեն' : course.language || 'Հայերեն'}</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-violet-600">
                  {displayPrice}
                </span>
                {originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {originalPrice}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Մանրամասն
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
