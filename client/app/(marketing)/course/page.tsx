'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useCourses } from './hooks/useCourses'
import { CourseCard } from './components/CourseCard'
import { LoadingCard } from './components/LoadingCard'

export default function CoursesPage() {
  const { courses, loading, error, refetch } = useCourses()

  return (
    <div className="min-h-screen bg-white">
      <Header forceWhiteBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-violet-900 to-purple-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
              Առցանց դասընթացներ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Զարգացրու քո <span className="text-amber-300">հմտությունները</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Պրոֆեսիոնալ դասընթացներ Wildberries-ում վաճառքներ անելու համար։
              Սովորիր փորձառու մասնագետներից և սկսիր քո բիզնեսը։
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {loading ? '...' : courses.length}
                </div>
                <div className="text-white/70 text-sm">Դասընթացներ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">1,500+</div>
                <div className="text-white/70 text-sm">Ուսանողներ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">4.9</div>
                <div className="text-white/70 text-sm">Վարկանիշ</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ամենահայթհայթ դասընթացները
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Ընտրիր քեզ համապատասխան դասընթացը և սկսիր ուսումնասիրել
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Պատրաստ ես սկսել՞
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Միացիր մեր ուսանողների համայնքին և սկսիր քո բիզնեսը Wildberries-ում
              </p>
              <Button
                size="lg"
                className="bg-white text-violet-600 hover:bg-white/90 shadow-xl"
              >
                Դիտել բոլոր դասընթացները
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
