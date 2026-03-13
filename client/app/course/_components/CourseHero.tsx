import Link from 'next/link'
import { Award, Calendar, ChevronRight, Globe, Star, Users } from 'lucide-react'

export interface CourseHeroData {
  title: string
  description: string
  rating: number
  reviewsCount: number
  studentsLabel: string
  author: string
  updatedAt: string
  language: string
}

interface CourseHeroProps {
  course: CourseHeroData
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="bg-gradient-to-br from-[#2e1065] via-[#1e1b4b] to-[#9d174d] text-white pt-32 pb-12 md:pb-20 relative overflow-hidden mb-10">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-fuchsia-500/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="container max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-300 font-medium mb-4">
              <Link href="/" className="hover:text-violet-400 transition-colors">
                Գլխավոր
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <Link href="/courses" className="hover:text-violet-400 transition-colors">
                Դասընթացներ
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-white">WB Mastery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight break-words">{course.title}</h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1 text-amber-400">
                <span className="font-bold text-base">{course.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 ml-1 underline">({course.reviewsCount} կարծիք)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4" />
                <span>{course.studentsLabel}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-violet-400" />
                <span>
                  Ստեղծվել է <span className="text-white font-bold underline decoration-violet-500/50">{course.author}</span>-ի կողմից
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span>Թարմացվել է {course.updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-violet-400" />
                <span>{course.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
