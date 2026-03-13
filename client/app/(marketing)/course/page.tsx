'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Users, ArrowRight, BookOpen, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface Course {
  id: number | string
  title: string
  description: string
  category?: string
  language?: string
  price: number | string
  discount?: number | string
  rating?: number
  reviewsCount?: number
  studentsCount?: number
  duration?: string
  imageUrl?: string
  whatToLearn?: string[]
  modules?: Array<{
    id?: number | string
    title?: string
    name?: string
    files?: Array<{
      name?: string
      ext?: string
      name_used?: string
    }>
  }>
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const price = typeof course.price === 'number' ? course.price : Number(course.price)
  const discount = course.discount ? Number(course.discount) : 0
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price

  const displayPrice = discountedPrice > 0 ? `${Math.round(discountedPrice).toLocaleString()} դրամ` : 'Անվճար'
  const originalPrice = discount > 0 ? `${price.toLocaleString()} դրամ` : null

  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbnailLoading, setThumbnailLoading] = useState(true)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''

  // Get first video from first module
  const firstModule = course.modules?.[0]
  const videoFiles = firstModule?.files?.filter((f) => f.name_used === 'module_video') || []
  const firstVideo = videoFiles[0]
  const hasVideo = firstVideo?.name && firstVideo?.ext

  useEffect(() => {
    if (!hasVideo) {
      setThumbnailLoading(false)
      return
    }

    const videoPath = `/files/modules/${firstVideo.name}${firstVideo.ext}`
    const videoUrl = `${origin}${videoPath}`

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      // Seek to 30 seconds or the middle if video is shorter
      const seekTime = Math.min(30, video.duration / 2)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
      }
      setThumbnailLoading(false)
    }

    video.onerror = () => {
      setThumbnailLoading(false)
    }
  }, [firstVideo, hasVideo, origin])

  const imageSrc = thumbnail || course.imageUrl || '/images/no-image.png'
  const showFallback = !hasVideo && !course.imageUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/course-details/${course.id}`}>
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

function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
        <div className="pt-4 border-t border-slate-100 flex justify-between">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
          <div className="h-8 bg-slate-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/v1/courses')
        const coursesData = res.data?.data || res.data?.courses || res.data || []
        setCourses(Array.isArray(coursesData) ? coursesData : [])
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Դասընթացները բեռնելու ժամանակ սխալ է տեղի ունեցել')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-[#F9F7FD]">
      <Header forceWhiteBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
              Առցանց դասընթացներ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Զարգացրու քո <span className="text-amber-300">հմտությունները</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Պրոֆեսիոնալ դասընթացներ Wildberries-ում վաճառքներ անելու համար։
              Սովորիր փորձառու մասնագետներից և սկսիր քո բիզնեսը։
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {loading ? '...' : courses.length}
                </div>
                <div className="text-white/70 text-sm">Դասընթացներ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">1,500+</div>
                <div className="text-white/70 text-sm">Ուսանողներ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">4.9</div>
                <div className="text-white/70 text-sm">Վարկանիշ</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ամենահայթհայթ դասընթացները
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Ընտրիր քեզ համապատասխան դասընթացը և սկսիր ուսումնասիրել
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Սխալ է տեղի ունեցել</h3>
              <p className="text-slate-500">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6"
              >
                Կրկին փորձել
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Դասընթացներ չեն գտնվել</h3>
              <p className="text-slate-500">Այս պահին դասընթացներ չկան։</p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Պատրաստ ես սկսել՞
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Միացիր մեր ուսանողների համայնքին և սկսիր քո բիզնեսը Wildberries-ում
              </p>
              <Button
                size="lg"
                className="bg-white text-violet-600 hover:bg-white/90 shadow-xl"
              >
                Դիտել բոլոր դասընթացները
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
