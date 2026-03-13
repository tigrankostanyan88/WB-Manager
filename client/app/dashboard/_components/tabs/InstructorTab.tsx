'use client'

import { Upload, Save } from 'lucide-react'

interface InstructorTabProps {
  instructorForm: {
    name: string
    profession: string
    description: string
    avatar: string
  }
  instructorErrors: Record<string, string>
  isInstructorLoading: boolean
  onAvatarFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNameChange: (value: string) => void
  onProfessionChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onStatValueChange: (index: number, field: string, value: string) => void
  onSubmit: () => void
}

export default function InstructorTab({
  instructorForm,
  isInstructorLoading,
  onAvatarFile,
  onNameChange,
  onProfessionChange,
  onDescriptionChange,
  onSubmit
}: InstructorTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Մենթոր</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {isInstructorLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {instructorForm.avatar ? (
                  <img
                    src={instructorForm.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarFile}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
              <div>
                <p className="text-sm text-slate-500">Նկարի չափը՝ 400x400px</p>
                <p className="text-sm text-slate-500">Ֆորմատ՝ JPG, PNG</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Անուն</label>
              <input
                type="text"
                value={instructorForm.name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Մասնագիտություն</label>
              <input
                type="text"
                value={instructorForm.profession}
                onChange={(e) => onProfessionChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Նկարագրություն</label>
              <textarea
                value={instructorForm.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <button
              onClick={onSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Պահպանել
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
