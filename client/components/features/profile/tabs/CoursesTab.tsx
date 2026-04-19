'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { UserCourse } from '../hooks/useProfileData'

interface CoursesTabProps {
  isLoadingData: boolean
  myCourses: UserCourse[]
}

export function CoursesTab({ isLoadingData, myCourses }: CoursesTabProps) {
  return (
    <motion.div
      key="courses"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4 sm:space-y-8 min-w-0 w-full"
    >
      <div className="flex items-center justify-between px-2">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {isLoadingData ? (
          [1, 2].map((i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)
        ) : myCourses.length > 0 ? (
          myCourses.map((course) => (
            <Link
              key={course.id}
              href={`/course-details/${course.id}`}
              prefetch={true}
              className="block group"
            >
              <Card className="h-full bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-slate-200/50 overflow-hidden border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-2 bg-slate-200" />
                <CardContent className="p-4 sm:p-8">
                  <div className="flex justify-between items-start mb-4 sm:mb-8">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <span className={cn('px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border shadow-sm w-fit', course.color, course.borderColor)}>
                        {course.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">Վճարված է</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-slate-900 mb-2 sm:mb-4 leading-snug group-hover:text-violet-600 transition-colors tracking-tight line-clamp-2">{course.title}</h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-6 sm:mb-10 leading-relaxed line-clamp-2">{course.desc}</p>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-black mb-1">
                      <span className="text-slate-400 uppercase tracking-widest">ԱՌԱՋԸՆԹԱՑ</span>
                      <span className="text-slate-600">{course.progress}%</span>
                    </div>
                    <div className="h-3 sm:h-4 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 sm:p-1 border border-slate-100 shadow-inner">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className={cn(
                          'h-full rounded-full shadow-lg transition-all duration-1000 ease-out',
                          course.progress === 100 ? 'bg-slate-400' : 'bg-slate-600'
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-10 flex gap-4">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl sm:rounded-[1.2rem] font-black h-11 sm:h-14 text-sm sm:text-base shadow-xl transition-all duration-300">
                      Շարունակել
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 px-4">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Դեռ չկան դասընթացներ</h3>
            <p className="text-slate-500 mb-4 sm:mb-6 text-sm sm:text-base">Սկսեք սովորել մեր դասընթացներից</p>
            <Link href="/courses" prefetch={true}>
              <Button className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-6 sm:px-8 h-11 sm:h-12 font-bold text-sm sm:text-base">
                Դիտել դասընթացները
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

