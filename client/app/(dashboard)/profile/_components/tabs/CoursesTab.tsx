'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { UserCourse } from '../../_hooks/useProfileData'

interface CoursesTabProps {
  isLoadingData: boolean
  myCourses: UserCourse[]
}

export default function CoursesTab({ isLoadingData, myCourses }: CoursesTabProps) {
  return (
    <motion.div
      key="courses"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between px-2">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoadingData ? (
          [1, 2].map((i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)
        ) : myCourses.length > 0 ? (
          myCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group block"
            >
              <Card className="h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-violet-500 to-indigo-600" />
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-2">
                      <span className={cn('px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm w-fit', course.color, course.borderColor)}>
                        {course.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Վճարված է</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-violet-600 transition-colors tracking-tight">{course.title}</h4>
                  <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-10 leading-relaxed">{course.desc}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black mb-1">
                      <span className="text-slate-400 uppercase tracking-widest">ԱՌԱՋԸՆԹԱՑ</span>
                      <span className="text-violet-600">{course.progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className={cn(
                          'h-full rounded-full shadow-lg transition-all duration-1000 ease-out',
                          course.progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-violet-500 to-indigo-600'
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-[1.2rem] font-black h-14 text-base shadow-xl transition-all duration-300">
                      Շարունակել
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-lg shadow-slate-200/50">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Դեռ չկան դասընթացներ</h3>
            <p className="text-slate-500 mb-6">Սկսեք սովորել մեր դասընթացներից</p>
            <Link href="/courses">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 h-12 font-bold">
                Դիտել դասընթացները
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

