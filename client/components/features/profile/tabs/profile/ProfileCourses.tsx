'use client'

import Link from 'next/link'
import { Clock, ChevronRight, PlayCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { UserCourse } from '../../hooks/useProfileData'

interface ProfileCoursesProps {
  courses: UserCourse[]
  isLoading: boolean
  onViewAll: () => void
}

export function ProfileCourses({ courses, isLoading, onViewAll }: ProfileCoursesProps) {
  return (
    <div className="space-y-5">
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
                      <span className="text-slate-400 text-[10px] font-black flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
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
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div
                          style={{ width: `${course.progress}%` }}
                          className={cn(
                            'h-full rounded-full shadow-lg transition-all duration-1000 ease-out',
                            course.progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-violet-500 to-indigo-600'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-7 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-center">
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
          <div className="col-span-2 py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group hover:border-violet-300 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-black tracking-tight">Դեռ չկան դասընթացներ</p>
              <p className="text-slate-400 text-xs font-medium">Գտեք ձեզ համապատասխան դասընթացը հենց հիմա</p>
            </div>
            <Button className="mt-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg h-10 px-6 font-black text-xs">Դիտել կատալոգը</Button>
          </div>
        )}
      </div>
    </div>
  )
}
