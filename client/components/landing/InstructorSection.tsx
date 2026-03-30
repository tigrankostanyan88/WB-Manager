'use client'

// client/components/landing/InstructorSection.tsx

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Star, Users, TrendingUp, Clock, HeadphonesIcon } from 'lucide-react'
import type { Instructor, InstructorStat } from '@/types/instructor'

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
const DEFAULT_AVATAR = ''

export function InstructorSection({ instructor, onOpenModal }: InstructorSectionProps) {
  const stats = instructor.stats?.length ? instructor.stats : DEFAULT_STATS
  const displayStats = stats.slice(0, 4)

  return (
    <section id="instructor" className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-violet-900/20 group bg-slate-100">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
              {instructor.avatarUrl ? (
                <Image
                  src={instructor.avatarUrl}
                  alt="Instructor"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <Users className="w-24 h-24 text-slate-400" />
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white transform transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
                    <h3 className="text-base sm:text-2xl font-bold truncate">
                      {instructor.name || 'Մենթորի անուն'}
                    </h3>
                    <div className="bg-violet-500 rounded-full p-1.5 sm:p-2 shrink-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-slate-200 font-medium text-xs sm:text-base leading-tight sm:leading-normal">
                    {instructor.profession || 'Մասնագիտություն'}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-violet-400 rounded-full blur-2xl opacity-30" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400 rounded-full blur-3xl opacity-20" />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700 mb-4">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Ձեր գլխավոր մենթորը
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  {instructor.title || 'Մենթորի'}
                </h2>
              </div>
              {instructor.profession && (
                <p className="text-lg text-slate-500 mb-2">{instructor.profession}</p>
              )}
              <p className="text-lg text-slate-600 leading-relaxed">
                {instructor.description || DEFAULT_DESCRIPTION}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {displayStats.map((stat, i) => {
                const IconComponent = STAT_ICONS[i] || Users
                return (
                  <div key={i} className="group bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-3xl font-black text-slate-900 mb-0.5 sm:mb-1">
                          {stat.value || '—'}
                        </div>
                        <p className="text-[10px] sm:text-sm font-medium text-slate-500 leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/course" prefetch={true} className="w-full sm:w-auto">
                <Button
                  className="h-14 rounded-full px-8 text-lg font-bold bg-slate-900 text-white hover:bg-violet-600 transition-colors shadow-xl shadow-slate-200 w-full"
                >
                  Սկսել ուսուցումը
                </Button>
              </Link>
              <Link href="/#reviews" prefetch={true} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-14 rounded-full px-8 text-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-full"
                >
                  Տեսնել արդյունքները
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
