'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  id: number | string
  name?: string
  rating?: number
  comment?: string
  createdAt?: string
  user?: {
    name?: string
    files?: Array<{
      name_used?: string
      table_name?: string
      name?: string
      ext?: string
    }>
  }
}

interface Instructor {
  name?: string
  title?: string
  avatarUrl?: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [instructor, setInstructor] = useState<Instructor | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const reviewsRes = await api.get('/api/v1/reviews')
        const payload = reviewsRes.data as { reviews?: Review[]; data?: Review[] }
        let list: Review[] = []
        if (Array.isArray(payload.reviews)) {
          list = payload.reviews
        } else if (Array.isArray(payload.data)) {
          list = payload.data
        }
        setReviews(list.slice(0, 6))

        // Fetch instructor data
        const instructorRes = await api.get('/api/v1/instructor')
        const instructorData = instructorRes.data?.data
        if (instructorData) {
          // Get instructor avatar
          let avatarUrl = ''
          if (instructorData.files && instructorData.files.length > 0) {
            const imgFile = instructorData.files.find((f: any) => f.name_used === 'instructor_img') || instructorData.files[0]
            if (imgFile) {
              const ext = imgFile.ext?.startsWith('.') ? imgFile.ext.slice(1) : imgFile.ext
              avatarUrl = `/api/images/instructors/large/${imgFile.name}.${ext}`
            }
          }
          setInstructor({
            name: instructorData.name,
            title: instructorData.profession,
            avatarUrl
          })
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, reviews.length)) % Math.max(1, reviews.length))
  }

  const currentReview = reviews[currentIndex]

  // Generate avatar URLs for "Trusted Clients" badge
  const trustedClients = [
    'https://i.pravatar.cc/100?img=1',
    'https://i.pravatar.cc/100?img=2',
    'https://i.pravatar.cc/100?img=3',
    'https://i.pravatar.cc/100?img=4',
  ]

  if (isLoading) {
    return (
      <section id="reviews" className="w-full py-20 md:py-28 bg-[#0f0f1a]">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section id="reviews" className="w-full py-20 md:py-28 bg-[#0f0f1a] relative overflow-hidden">
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Decorative dots */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-violet-500/30 rounded-full" />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-violet-500/20 rounded-full" />
      <div className="absolute bottom-32 left-16 w-2 h-2 bg-violet-500/25 rounded-full" />
      <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-violet-500/20 rounded-full" />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-violet-500/30 rounded-full" />

      <div className="container relative z-10 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Մեր կարծիքները
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Ուսանողները մեր մասին
          </h2>
        </div>

        {/* Main content - two columns */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Instructor Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
                {instructor?.avatarUrl ? (
                  <img 
                    src={instructor.avatarUrl} 
                    alt={instructor.name || 'Մենթոր'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                    <span className="text-6xl text-white/50">👨‍🏫</span>
                  </div>
                )}
                
                {/* Trusted Clients Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-xl">
                  <div className="flex -space-x-2">
                    {trustedClients.map((src, idx) => (
                      <div 
                        key={idx}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      +
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Վստահելի ուսանողներ</span>
                </div>
              </div>
            </div>

            {/* Right side - Testimonial Card */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {currentReview && (
                  <motion.div
                    key={currentReview.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
                  >
                    {/* Quote icon */}
                    <div className="mb-6">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-white/80">
                        <path d="M14 24C14 18.4772 18.4772 14 24 14M24 14V24M24 14C29.5228 14 34 18.4772 34 24C34 26.5 33 28.5 31.5 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M24 24C24 29.5228 19.5228 34 14 34M14 34V24M14 34C8.47715 34 4 29.5228 4 24C4 21.5 5 19.5 6.5 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= (currentReview.rating || 5) ? 'fill-white text-white' : 'text-white/30'}`}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-white/95 text-lg leading-relaxed mb-8">
                      {currentReview.comment || 'Շատ հավանեցի դասընթացը! Մենթորը պրոֆեսիոնալ է և մատչելի բացատրում է ամեն ինչ։ Իրական փորձի հիման վրա սովորեցնում են, ինչը շատ կարևոր է։'}
                    </p>

                    {/* User info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {currentReview.name?.charAt(0).toUpperCase() || 'Ո'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">
                          {currentReview.name || 'Ուսանող'}
                        </h4>
                        <p className="text-white/70 text-sm">
                          WB Mastery ուսանող
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation arrows */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-12">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-violet-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
