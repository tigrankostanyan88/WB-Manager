'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CheckCircle, Users, TrendingUp, Clock, HeadphonesIcon, Award, Sparkles } from 'lucide-react'
import type { Instructor, InstructorStat } from '@/types/domain'
import DOMPurify from 'isomorphic-dompurify'

// Safe HTML sanitizer that works on both client and server
function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: []
  })
}

interface InstructorSectionProps {
  instructor: Instructor
}

const DEFAULT_STATS: InstructorStat[] = []

const STAT_ICONS = [
  Users,
  TrendingUp,
  Clock,
  HeadphonesIcon,
]

export function InstructorSection({ instructor }: InstructorSectionProps) {
  const safeInstructor = instructor ?? { name: '', stats: [] }
  const stats = safeInstructor.stats?.length ? safeInstructor.stats : DEFAULT_STATS
  const displayStats = stats.slice(0, 4)
  const reduceMotion = useReducedMotion()

  // Animation props - disabled on mobile
  const fadeInUp = reduceMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <section id="instructor" className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-violet-50/30 to-white">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-5 py-2 rounded-full text-sm font-bold mb-4 shadow-sm">
            <Award className="w-4 h-4" />
            Ձեր գլխավոր մենթորը
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            {safeInstructor.title || 'Մենթորի'}
          </h2>
        </motion.div>

        {/* Card */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-violet-100/50 border border-slate-100 overflow-hidden w-full">
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="w-full lg:w-2/5 relative lg:rounded-l-[2.5rem] overflow-hidden">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[280px] sm:min-h-[400px] lg:min-h-[600px] rounded-t-[1.5rem] sm:rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-l-[2.5rem] overflow-hidden">
                  {safeInstructor.avatarUrl ? (
                    <Image
                      src={safeInstructor.avatarUrl}
                      alt={safeInstructor.name || 'Մենթոր'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-slate-100">
                      <Users className="w-32 h-32 text-violet-300" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-5 shadow-xl border border-white/50">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                            {safeInstructor.name || 'Աննա Մանուկյան'}
                          </h3>
                          <p className="text-violet-600 font-medium text-[10px] sm:text-sm truncate">
                            {safeInstructor.profession || 'Wildberries փորձագետ'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                        <span className="bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">Top Seller</span>
                        <span className="bg-fuchsia-100 text-fuchsia-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">5+ տարի փորձ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-3/5 p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  {/* Pro badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="truncate">Վերցրեք գիտելիքներ պրոֆեսիոնալից</span>
                  </div>

                  {/* Bio */}
                  <div
                    className="text-slate-600 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8 prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: sanitizeHtml(safeInstructor.description || '<p>Սովորեք Wildberries-ում վաճառելու ճիշտ մոտեցումները փորձառու մենթորից։ Դասընթացը ներառում է բիզնեսի սկսելու, ապրանքների ընտրության, լիստինգի օպտիմալացման և վաճառքների աճի բոլոր հիմնական քայլերը։</p>')
                    }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                  {displayStats.length > 0 ? displayStats.map((stat, i) => {
                    const IconComponent = STAT_ICONS[i] || Users
                    const colors = [
                      'from-violet-500 to-purple-500',
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-orange-500 to-amber-500',
                    ]
                    return (
                      <div key={i} className="group bg-slate-50 rounded-2xl p-3 sm:p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                              {stat.value || '—'}
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                    // Fallback stats
                    <>
                      <div className="group bg-slate-50 rounded-2xl p-3 sm:p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">500+</div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Ուսանողներ</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-3 sm:p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">120M₽</div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Շրջանառություն</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-3 sm:p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">5ժ</div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Տևողություն</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-3 sm:p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <HeadphonesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">24/7</div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Աջակցություն</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/course" prefetch={true} className="w-full sm:w-auto">
                    <Button
                      className="h-12 sm:h-14 rounded-full px-6 sm:px-8 text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-violet-600 text-white hover:shadow-xl hover:shadow-violet-200 transition-all w-full"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="truncate">Սկսել ուսուցումը</span>
                    </Button>
                  </Link>
                  <Link href="/#reviews" prefetch={true} className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="h-12 sm:h-14 rounded-full px-6 sm:px-8 text-base sm:text-lg font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-violet-200 hover:text-violet-700 transition-all w-full"
                    >
                      <span className="truncate">Տեսնել արդյունքները</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
