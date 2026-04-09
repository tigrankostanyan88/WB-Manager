'use client'

import Link from 'next/link'
import { Clock, ChevronRight, PlayCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { UserCourse } from '@/components/features/profile/hooks/useProfileData'

interface ProfileCoursesProps {
  courses: UserCourse[]
  isLoading: boolean
  onViewAll: () => void
}

export function ProfileCourses({ courses, isLoading, onViewAll }: ProfileCoursesProps) {
  return (
    <div className="space-y-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Իմ դասընթացները</h3>
        <button onClick={onViewAll} className="text-xs font-black text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1.5 group">
          Դիտել բոլորը
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [1, 2].map((i) => <div key={i} className="h-56 bg-white rounded-2xl animate-pulse" />)
        ) : courses.length > 0 ? (
          courses.slice(0, 2).map((course) => (
            <Link key={course.id} href={`/course-details/${course.id}`} prefetch={true} className="block group">
              <Card className="shadow-xl shadow-slate-200/30 rounded-2xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100/50">
                <CardContent className="p-0">
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-5">
                      <span className={cn('px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm', course.color, course.borderColor)}>
                        {course.status}
                      </span>
                      <span className="text-slate-400 text-[10px] font-black flex items-center gap-1.5 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3 h-3" /> {course.lessons} դաս
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-violet-600 transition-colors tracking-tight">{course.title}</h4>
                    <p className="text-[13px] font-medium text-slate-500 line-clamp-2 mb-6 leading-relaxed">{course.desc}</p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-[9px] font-black mb-0.5">
                        <span className="text-slate-400 uppercase tracking-widest">ԱՌԱՋԸՆԹԱՑ</span>
                        <span className="text-violet-600">{course.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white border border-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          style={{ width: `${course.progress}%` }}
                          className={cn(
                            'h-full rounded-full shadow-lg transition-all duration-1000 ease-out',
                            course.progress === 100 ? 'bg-slate-400' : 'bg-slate-600'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-7 py-5 bg-white border-t border-slate-100 flex justify-center">
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white border border-slate-200 rounded-xl h-12 text-[13px] font-black transition-all duration-500 flex items-center gap-2 group/btn shadow-sm hover:shadow-xl">
                      <PlayCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                      Շարունակել դիտել
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-2 py-24 text-center bg-gradient-to-br from-violet-100/60 via-white to-blue-100/60 rounded-3xl border border-violet-200/60 flex flex-col items-center justify-center gap-6 group hover:shadow-2xl hover:shadow-violet-200/40 transition-all duration-500 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-violet-300/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-violet-300/50 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
            </div>

            {/* Main icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/30 rounded-3xl blur-xl scale-150 animate-pulse pointer-events-none" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-violet-300/50">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3 relative z-10">
              <p className="text-slate-900 font-bold text-xl tracking-tight">Դեռ չկան դասընթացներ</p>
              <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">Սկսեք ձեր ուսումնառությունը՝ ընտրելով համապատասխան դասընթացը</p>
            </div>

            {/* CTA Button */}
            <Button className="mt-2 bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 hover:from-violet-700 hover:via-violet-800 hover:to-indigo-800 text-white rounded-xl h-12 px-10 font-bold text-sm shadow-xl shadow-violet-300/50 hover:shadow-2xl hover:shadow-violet-400/40 transition-all relative z-10 group/btn">
              <span className="mr-2">Դիտել կատալոգը</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
