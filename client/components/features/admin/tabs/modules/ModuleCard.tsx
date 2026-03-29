// tabs/modules/ModuleCard.tsx - Individual module card display

import { Video, Clock, BookOpen, Edit, Trash2 } from 'lucide-react'
import type { ModuleItem, CourseOption } from '@/components/features/admin/hooks/modules/types'
import { formatMinutes, getVideoCount, getTotalVideoDuration } from '@/components/features/admin/hooks/modules/utils'

interface ModuleCardProps {
  module: ModuleItem
  courses: CourseOption[]
  onEdit: (module: ModuleItem) => void
  onDelete: (id: string) => void
}

export function ModuleCard({ module, courses, onEdit, onDelete }: ModuleCardProps) {
  const videoCount = getVideoCount(module)
  const totalDurationMinutes = getTotalVideoDuration(module)
  const courseName = courses.find(c => c.id === module.courseId)?.title || 'Unknown course'

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden">
      {/* Card Header with Course Badge */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            {courseName}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-violet-700 transition-colors">
          {module.title}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Video className="w-4 h-4 text-violet-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Վիդեոներ</span>
              <span className="text-sm font-semibold">{videoCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Տևողություն</span>
              <span className="text-sm font-semibold">{formatMinutes(totalDurationMinutes)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(module)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Փոփոխել
          </button>
          <button
            onClick={() => onDelete(module.id)}
            className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
