'use client'

// client/components/landing/InstructorSection.tsx

import { Button } from '@/components/ui/button'
import { CheckCircle, Star } from 'lucide-react'
import type { Instructor, InstructorStat } from '@/types/instructor'

interface InstructorSectionProps {
  instructor: Instructor
  onOpenModal: () => void
}

const DEFAULT_STATS: InstructorStat[] = [
  { value: '500+', label: 'Հաջողակ ուսանողներ' },
  { value: '₽120M+', label: 'Ուսանողների ընդհանուր շրջանառությունը' },
  { value: '5 տարի', label: 'Փորձ e-commerce ոլորտում' },
  { value: '24/7', label: 'Անհատական աջակցություն' },
]

const INSTRUCTOR_NAME = 'Արմեն Սարգսյան'
const INSTRUCTOR_ROLE = 'Wildberries Էքսպերտ & Բիզնես Մենթոր'
const DEFAULT_DESCRIPTION = 'Ես չեմ սովորեցնում տեսություն, ես փոխանցում եմ իրական գործնական փորձը Wildberries-ում:'
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop'

export function InstructorSection({ instructor, onOpenModal }: InstructorSectionProps) {
  const stats = instructor.stats?.length ? instructor.stats : DEFAULT_STATS
  const displayStats = stats.slice(0, 4)

  return (
    <section id="instructor" className="w-full py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-900/20 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
              <img
                src={instructor.avatarUrl || DEFAULT_AVATAR}
                alt="Instructor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white transform transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
                    <h3 className="text-base sm:text-2xl font-bold truncate">
                      {INSTRUCTOR_NAME}
                    </h3>
                    <div className="bg-violet-500 rounded-full p-1.5 sm:p-2 shrink-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-slate-200 font-medium text-xs sm:text-base leading-tight sm:leading-normal">
                    {INSTRUCTOR_ROLE}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-violet-600 rounded-full blur-3xl opacity-20" />
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700 mb-6">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Ձեր գլխավոր մենթորը
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                Սովորեք <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Պրակտիկ Մասնագետից</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {instructor.description || DEFAULT_DESCRIPTION}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {displayStats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-3 sm:p-6 rounded-[1rem] sm:rounded-[2rem] shadow-sm border border-slate-100 hover:border-violet-100 hover:shadow-md transition-all"
                >
                  <div className="text-xl sm:text-4xl font-black text-slate-900 mb-1 sm:mb-2">
                    {s.value || '—'}
                  </div>
                  <p className="text-[10px] sm:text-sm font-medium text-slate-500 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="h-14 rounded-full px-8 text-lg font-bold bg-slate-900 text-white hover:bg-violet-600 transition-colors shadow-xl shadow-slate-200"
                onClick={onOpenModal}
              >
                Սկսել ուսուցումը
              </Button>
              <Button
                variant="outline"
                className="h-14 rounded-full px-8 text-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                Տեսնել արդյունքները
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
