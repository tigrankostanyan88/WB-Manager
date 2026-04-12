'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Star, Users, TrendingUp, Clock, HeadphonesIcon, Award, Sparkles } from 'lucide-react'
import type { Instructor, InstructorStat } from '@/types/domain'

interface InstructorSectionProps {
  instructor: Instructor
  onOpenModal: () => void
}

const DEFAULT_STATS: InstructorStat[] = []

const STAT_ICONS = [
  Users,
  TrendingUp,
  Clock,
  HeadphonesIcon,
]

const DEFAULT_DESCRIPTION = ''

export function InstructorSection({ instructor, onOpenModal }: InstructorSectionProps) {
  const safeInstructor = instructor ?? { name: '', stats: [] }
  const stats = safeInstructor.stats?.length ? safeInstructor.stats : DEFAULT_STATS
  const displayStats = stats.slice(0, 4)

  return (
    <section id="instructor" className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-violet-50/30 to-white">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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

        {/* Main Content Card */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-violet-100/50 border border-slate-100 overflow-hidden w-full">
            <div className="flex flex-col lg:flex-row">
              {/* Image Side */}
              <div className="w-full lg:w-2/5 relative lg:rounded-l-[2.5rem] overflow-hidden">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px] lg:min-h-[600px] rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-l-[2.5rem] overflow-hidden">
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
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  
                  {/* Info Card on Image */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/50">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 truncate">
                            {safeInstructor.name || 'Աննա Մանուկյան'}
                          </h3>
                          <p className="text-violet-600 font-medium text-sm">
                            {safeInstructor.profession || 'Wildberries փորձագետ'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">Top Seller</span>
                        <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full">5+ տարի փորձ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                    <Sparkles className="w-4 h-4" />
                    Վերցրեք գիտելիքներ պրոֆեսիոնալից
                  </div>

                  {/* Description */}
                  <div 
                    className="text-slate-600 leading-relaxed text-lg mb-8 prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(safeInstructor.description || '<p>Սովորեք Wildberries-ում վաճառելու ճիշտ մոտեցումները փորձառու մենթորից։ Դասընթացը ներառում է բիզնեսի սկսելու, ապրանքների ընտրության, լիստինգի օպտիմալացման և վաճառքների աճի բոլոր հիմնական քայլերը։</p>')
                    }}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {displayStats.length > 0 ? displayStats.map((stat, i) => {
                    const IconComponent = STAT_ICONS[i] || Users
                    const colors = [
                      'from-violet-500 to-purple-500',
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-orange-500 to-amber-500',
                    ]
                    return (
                      <div key={i} className="group bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900">
                              {stat.value || '—'}
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                    // Default stats if none provided
                    <>
                      <div className="group bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900">500+</div>
                            <p className="text-sm font-medium text-slate-500">Ուսանողներ</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900">120M₽</div>
                            <p className="text-sm font-medium text-slate-500">Շրջանառություն</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900">5ժ</div>
                            <p className="text-sm font-medium text-slate-500">Տևողություն</p>
                          </div>
                        </div>
                      </div>
                      <div className="group bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-violet-100/30 border border-slate-100 hover:border-violet-200 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                            <HeadphonesIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900">24/7</div>
                            <p className="text-sm font-medium text-slate-500">Աջակցություն</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/course" prefetch={true} className="w-full sm:w-auto">
                    <Button
                      className="h-14 rounded-full px-8 text-lg font-bold bg-gradient-to-r from-slate-900 to-violet-600 text-white hover:shadow-xl hover:shadow-violet-200 transition-all w-full"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Սկսել ուսուցումը
                    </Button>
                  </Link>
                  <Link href="/#reviews" prefetch={true} className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="h-14 rounded-full px-8 text-lg font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-violet-200 hover:text-violet-700 transition-all w-full"
                    >
                      Տեսնել արդյունքները
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
