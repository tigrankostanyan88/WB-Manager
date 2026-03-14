'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, BookOpen, ChevronRight, Clock, Mail, MapPin, Phone, PlayCircle, Shield, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface ProfileUser {
  role?: string
  email: string
  phone: string
  address: string
}

interface StatsData {
  currentLessons?: string
  progress?: number
  points?: number
  certificates?: string
  [key: string]: unknown
}

interface ReviewData {
  id: string
  rating: number
  comment: string
  [key: string]: unknown
}

interface CourseItem {
  id: string
  title: string
  desc: string
  status: string
  lessons?: number
  progress: number
  color?: string
  borderColor?: string
  [key: string]: unknown
}

interface ProfileTabProps {
  user: ProfileUser
  stats: StatsData | null
  isLoadingData: boolean
  myCourses: CourseItem[]
  onViewAllCourses: () => void
}

export default function ProfileTab({
  user,
  stats,
  isLoadingData,
  myCourses,
  onViewAllCourses
}: ProfileTabProps) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ընթացիկ դասեր', val: stats?.currentLessons || '0/0', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-100' },
          { label: 'Առաջընթաց', val: `${stats?.progress || 0}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', borderColor: 'border-violet-100' },
          { label: 'Միավորներ', val: stats?.points?.toLocaleString() || '0', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
          { label: 'Սերտիֆիկատ', val: stats?.certificates || '0', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -4, scale: 1.02 }} 
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Card className={`${stat.bg} ${stat.borderColor} border-2 shadow-sm rounded-2xl overflow-hidden group-hover:shadow-lg transition-all duration-300 h-full`}>
              {isLoadingData ? (
                <CardContent className="p-5 flex items-center gap-3.5 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-white/50" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-12 bg-white/50 rounded" />
                    <div className="h-3 w-10 bg-white/50 rounded" />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-5 flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} border border-white`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Իմ դասընթացները</h3>
          <button onClick={onViewAllCourses} className="text-xs font-black text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1.5 group">
            Դիտել բոլորը
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingData ? (
            [1, 2].map((i) => <div key={i} className="h-56 bg-white rounded-2xl animate-pulse" />)
          ) : myCourses.length > 0 ? (
            myCourses.slice(0, 2).map((course) => (
              <Link key={course.id} href={`/course-details/${course.id}`} className="block group">
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

      <div className="space-y-4 mb-20">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight px-1">Անձնական տվյալներ</h3>
        <Card className="shadow-xl shadow-slate-200/20 rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {[
                { label: 'Էլ. հասցե', val: user.email, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Հեռախոս', val: user.phone, icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Հասցե', val: user.address, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Կարգավիճակ', val: user.role === 'admin' ? 'Ադմինիստրատոր' : 'Ուսանող', icon: Shield, color: 'text-violet-500', bg: 'bg-violet-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110', item.bg)}>
                    <item.icon className={cn('w-4.5 h-4.5', item.color)} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="text-[13px] font-bold text-slate-900 truncate max-w-[200px]">{item.val || 'Նշված չէ'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-black text-slate-900 px-2">Դասընթացների վճարումներ</h4>
        <Card className="shadow-sm rounded-2xl bg-white overflow-hidden border border-slate-50">
          <CardContent className="p-0">
            {myCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', 'bg-slate-100 text-slate-600')}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{course.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Վճարված է</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">Ակտիվ</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Հավերժ մուտք</p>
                </div>
              </div>
            ))}
            {myCourses.length === 0 && (
              <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Վճարված դասընթացներ չկան</div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
