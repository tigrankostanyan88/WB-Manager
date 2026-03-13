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
  instructors: Instructor[]
}

export default function CourseInstructors({ instructors }: CourseInstructorsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Դասավանդողներ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instructors.map((p, i) => (
          <Card key={i} className="border border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-sm">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="font-black text-slate-900 text-lg underline decoration-violet-500/30 decoration-2 underline-offset-4">{p.name}</div>
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">{p.role}</div>
                <p className="text-sm text-slate-600 pt-2 leading-relaxed">{p.desc}</p>
                <div className="flex gap-3 pt-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {p.ratingText}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Play className="w-3 h-3 text-slate-400" /> {p.coursesText}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

