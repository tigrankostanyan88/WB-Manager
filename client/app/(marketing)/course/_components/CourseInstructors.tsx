import { Card, CardContent } from '@/components/ui/card'
import { Play, Star } from 'lucide-react'

export interface Instructor {
  name: string
  role: string
  desc: string
  imageUrl: string
  ratingText: string
  coursesText: string
}

interface CourseInstructorsProps {
  instructor: Instructor | null
}

export default function CourseInstructors({ instructor }: CourseInstructorsProps) {
  if (!instructor) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Դասավանդող</h2>
      <div className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 rounded-3xl p-8 border border-violet-100 shadow-lg shadow-violet-100/50">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-white shadow-xl shadow-violet-200/50 ring-4 ring-white">
              <img 
                src={instructor.imageUrl} 
                alt={instructor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {instructor.ratingText}
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h3 className="text-2xl font-black text-slate-900">{instructor.name}</h3>
              <p className="text-violet-600 font-semibold text-sm mt-1">{instructor.role}</p>
            </div>
            
            <p className="text-slate-600 leading-relaxed max-w-lg">{instructor.desc}</p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <Play className="w-4 h-4 text-violet-600" />
                </div>
                <span className="font-medium">{instructor.coursesText}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="font-medium">{instructor.ratingText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

