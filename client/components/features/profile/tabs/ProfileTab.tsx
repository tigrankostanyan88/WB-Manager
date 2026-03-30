'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, BookOpen, BookOpenCheck, ChevronRight, Clock, CreditCard, Mail, MapPin, Phone, PlayCircle, Shield, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'
import type { UserCourse, Payment } from '../hooks/useProfileData'

interface ProfileUser {
  role?: string
  email: string
  phone: string
  address: string
  course_ids?: string[]
}

interface StatsData {
  currentLessons?: string
  progress?: number
  points?: number
  certificates?: string
  [key: string]: unknown
}

interface ProfileTabProps {
  user: ProfileUser
  stats: StatsData | null
  isLoadingData: boolean
  myCourses: UserCourse[]
  myPayments: Payment[]
  onViewAllCourses: () => void
}

export default function ProfileTab({
  user,
  stats,
  isLoadingData,
  myCourses,
  myPayments,
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
          { label: 'Միավորներ', val: stats?.points?.toLocaleString() || '0', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' },
          { label: 'Սերտիֆիկատ', val: 'Տրվում է', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
          { label: 'Գրանցված եմ', val: `${myCourses.length || 0} դասընթաց`, icon: BookOpenCheck, color: 'text-pink-600', bg: 'bg-pink-50', borderColor: 'border-pink-100' },
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

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xl font-black text-slate-900">Իմ վճարումները</h4>
          <span className="text-xs font-bold text-slate-400">Վճարման ID | Կուրսի ID</span>
        </div>
        <Card className="shadow-sm rounded-2xl bg-white overflow-hidden border border-slate-50">
          <CardContent className="p-0">
            {isLoadingData ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 border-b border-slate-50 last:border-0 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-100 rounded" />
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 w-20 bg-slate-100 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
              ))
            ) : myPayments.length > 0 ? (
              myPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', 
                      payment.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                      payment.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                    )}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{payment.course?.title || 'Դասընթաց'}</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <span className="font-mono">Վճ.ID: {payment.id}</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-mono">Կուրս.ID: {payment.course_id || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{payment.amount?.toLocaleString()} ֏</p>
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse',
                        payment.status === 'success' ? 'bg-emerald-500' : 
                        payment.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      )}></div>
                      <span className={cn('text-[10px] font-black uppercase tracking-widest',
                        payment.status === 'success' ? 'text-emerald-600' : 
                        payment.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {payment.status === 'success' ? 'Հաստատված' : 
                         payment.status === 'pending' ? 'Սպասում' : 'Մերժված'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Վճարումներ չկան</div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
