'use client'

import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Module } from '../../_types'

interface ModulesTabProps {
  showModuleForm: boolean
  moduleForm: { title: string; description: string; courseId: string }
  setModuleForm: React.Dispatch<React.SetStateAction<any>>
  allModules: Module[]
  courses: { _id: string; title: string }[]
  isLoading: boolean
  editingId: string | null
  startNewModule: () => void
  editModule: (module: Module) => void
  cancelNewModule: () => void
  submitModule: () => void
  deleteModule: (id: string) => void
  videoFile: File | null
  isUploadingVideo: boolean
  currentModuleVideos: any[]
  deleteModuleVideo: (moduleId: string, videoId: string) => void
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadModuleVideo: (moduleId: string) => void
  getVideoUrl: (videoId: string) => string
  reorderVideos: (moduleId: string, videoIds: string[]) => void
}

export default function ModulesTab({
  showModuleForm,
  moduleForm,
  setModuleForm,
  allModules,
  courses,
  isLoading,
  editingId,
  startNewModule,
  editModule,
  cancelNewModule,
  submitModule,
  deleteModule
}: ModulesTabProps) {
  if (showModuleForm) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {editingId ? 'Փոփոխել մոդուլը' : 'Նոր մոդուլ'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Դասընթաց</label>
            <select
              value={moduleForm.courseId}
              onChange={(e) => setModuleForm((prev: any) => ({ ...prev, courseId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Ընտրեք դասընթացը</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Անվանում</label>
            <input
              type="text"
              value={moduleForm.title}
              onChange={(e) => setModuleForm((prev: any) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Նկարագրություն</label>
            <textarea
              value={moduleForm.description}
              onChange={(e) => setModuleForm((prev: any) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={cancelNewModule}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Չեղարկել
            </button>
            <button
              type="button"
              onClick={submitModule}
              className="px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              {editingId ? 'Պահպանել' : 'Ստեղծել'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Մոդուլներ</h2>
        <button
          onClick={startNewModule}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ավելացնել
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : allModules.length > 0 ? (
        <div className="grid gap-4">
          {allModules.map((module) => (
            <div key={module._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{module.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                  <p className="text-sm text-violet-600 mt-2">
                    {courses.find(c => c._id === module.courseId)?.title || 'Unknown course'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editModule(module)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-slate-500" />
                  </button>
                  <button
                    onClick={() => deleteModule(module._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-12">Մոդուլներ չկան</p>
      )}
    </div>
  )
}
