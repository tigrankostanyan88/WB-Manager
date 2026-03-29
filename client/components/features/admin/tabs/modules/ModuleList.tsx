// tabs/modules/ModuleList.tsx - Module list/grid display

import { Plus, Video } from 'lucide-react'
import type { ModuleItem, CourseOption } from '@/components/features/admin/hooks/modules/types'
import { ModuleCard } from './ModuleCard'

interface ModuleListProps {
  modules: ModuleItem[]
  courses: CourseOption[]
  isLoading: boolean
  onAdd: () => void
  onEdit: (module: ModuleItem) => void
  onDelete: (id: string) => void
}

export function ModuleList({ modules, courses, isLoading, onAdd, onEdit, onDelete }: ModuleListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Մոդուլներ չկան</h3>
        <p className="text-sm text-slate-500 mt-1">Ավելացրեք ձեր առաջին մոդուլը</p>
        <button
          onClick={onAdd}
          className="mt-4 px-6 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          Ավելացնել մոդուլ
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Մոդուլներ</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ավելացնել
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            courses={courses}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
