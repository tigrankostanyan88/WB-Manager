'use client'

import { motion } from 'framer-motion'
import { Sparkles, Star, Zap, TrendingUp, Award } from 'lucide-react'
import { Header } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useCourses } from './hooks/useCourses'
import { CourseCard } from './components/CourseCard'
import { LoadingCard } from './components/LoadingCard'

export default function CoursesPage() {
  const { courses, loading, error, refetch, averageRating, totalReviews } = useCourses()

  return (
    <div className="min-h-screen bg-white">
      <Header forceWhiteBackground />

      {/* Hero Section - Stunning Design */}
      <section className="relative pt-8 pb-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900" />
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-20 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -30, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 -right-20 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" 
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* Floating Icons - Smooth gentle floating */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-[10%] text-white/20"
          >
            <Star className="w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-48 right-[15%] text-white/20"
          >
            <Zap className="w-10 h-10" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-[20%] text-white/20"
          >
            <TrendingUp className="w-12 h-12" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-32 right-[10%] text-white/20"
          >
            <Award className="w-8 h-8" />
          </motion.div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-sm border border-amber-400/30 text-amber-300 text-sm font-semibold rounded-full mb-8">
                <Sparkles className="w-4 h-4" />
                WB Մենթորի դասընթացները
                <Sparkles className="w-4 h-4" />
              </span>
            </motion.div>

            {/* Main Title with Gradient Text */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight px-4"
            >
              Պրոֆեսիոնալ
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                դասընթացներ
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-4"
            >
              Սովորիր <span className="text-white font-semibold">Wildberries-ում</span> վաճառելու ամենաարդյունավետ մեթոդները մեր փորձառու մենթորներից
            </motion.p>

            {/* Compact Stats - Inside Hero */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4"
            >
              {[
                { value: loading ? '...' : courses.length, label: 'Դասընթացներ', icon: '📚' },
                { value: loading ? '...' : courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0), label: 'Ուսանողներ', icon: '👥' },
                { value: loading ? '...' : averageRating.toFixed(1), label: 'Վարկանիշ', icon: '⭐' },
                { value: loading ? '...' : totalReviews, label: 'Կարծիքներ', icon: '📝' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-6 py-2 sm:py-3 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">{stat.icon}</span>
                    <div className="text-left">
                      <div className="text-lg sm:text-xl font-black text-white leading-none">{stat.value}</div>
                      <div className="text-white/60 text-[10px] sm:text-xs font-medium">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path 
              d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" 
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Սխալ է տեղի ունեցել</h3>
              <p className="text-slate-500">{error}</p>
              <Button onClick={refetch} className="mt-6">
                Կրկին փորձել
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Դասընթացներ չեն գտնվել</h3>
              <p className="text-slate-500">Այս պահին դասընթացներ չկան։</p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ինչու՞ ընտրել մեզ
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
              Մենք առաջարկում ենք որակյալ կրթություն, փորձառու մասնագետներ և անընդհատ աջակցություն
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Փորձառու մասնագետներ</h3>
              <p className="text-slate-500">Սովորիր WB-ի Top Seller-ներից, ովքեր արդեն ապացուցել են իրենց մասնագիտական որակները</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Պրակտիկ գիտելիքներ</h3>
              <p className="text-slate-500">Ոչ միայն տեսական գիտելիքներ, այլև պրակտիկ քայլեր դեպի առաջին վաճառքը</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Աջակցություն</h3>
              <p className="text-slate-500">Մեր թիմը միշտ պատրաստ է օգնել քեզ ցանկացած հարցում ուղու ընթացքում</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
