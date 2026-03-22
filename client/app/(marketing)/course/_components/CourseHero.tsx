import { Clock, Star, Play } from 'lucide-react'

export interface CourseHeroData {
  title: string
  description: string
  rating: number
  reviewsCount: number
  studentsLabel: string
  author: string
  updatedAt: string
  language: string
  image?: string
  previewVideoUrl?: string | null
}

interface CourseHeroProps {
  course: CourseHeroData
  onStartCourse?: () => void
}

export default function CourseHero({ course, onStartCourse }: CourseHeroProps) {
  const hasVideo = !!course.previewVideoUrl
  
  return (
    <div className="bg-slate-50 pt-8 pb-6">
      <div className="container max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Section Label */}
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
          Course Details
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Course Image / Video Preview */}
            <div className="md:w-2/5 bg-gradient-to-br from-violet-100 to-fuchsia-100 p-8 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : hasVideo ? (
                  <video
                    src={course.previewVideoUrl || ''}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                  />
                ) : null}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-violet-600 ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Course Preview Label */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white font-medium text-sm bg-black/30 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full">
                    Course Preview
                  </p>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div className="w-1/3 h-full bg-violet-600 rounded-full"></div>
              </div>

              {/* Category Tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold tracking-wider text-violet-600 uppercase">
                  Getting Started with Orchid
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">12h mastery class</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-medium">12h</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Star className="w-4 h-4 text-violet-600 fill-violet-600" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={onStartCourse}
                className="w-full md:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                START COURSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
