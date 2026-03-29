'use client'

import { useState, useCallback, useMemo } from 'react'
import { Plus, X, Camera } from 'lucide-react'
import type { CourseForm } from '@/components/features/admin/hooks/useCourses'
import type { Course } from '@/components/features/admin/types'
import { VideoFrameSelector } from '@/components/features/admin/components/VideoFrameSelector'

interface CourseFormProps {
  courseForm: CourseForm
  setCourseForm: React.Dispatch<React.SetStateAction<CourseForm>>
  isEditing: boolean
  editingCourseVideoUrl: string | null
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const categories = [
  'Միջին մակարդակ',
  'Առաջադեմ',
  'Մասնագիտական'
]

const languages = [
  { value: 'Armenian', label: 'Հայերեն' },
  { value: 'Russian', label: 'Ռուսերեն' },
  { value: 'English', label: 'Անգլերեն' }
]

export default function CourseFormComponent({
  courseForm,
  setCourseForm,
  isEditing,
  editingCourseVideoUrl,
  onCancel,
  onSubmit,
  onImageFileSelect
}: CourseFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoFrameSelectorOpen, setVideoFrameSelectorOpen] = useState(false)

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      onImageFileSelect?.(e)
    }
  }, [onImageFileSelect])

  const handleFrameCapture = useCallback((imageDataUrl: string, timestamp: number) => {
    setImagePreview(imageDataUrl)
    setCourseForm((prev) => ({ ...prev, thumbnail_time: String(timestamp) }))
  }, [setCourseForm])

  const addPrerequisite = () => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), '']
    }))
  }

  const updatePrerequisite = (index: number, value: string) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.map((p, i) => i === index ? value : p)
    }))
  }

  const removePrerequisite = (index: number) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }))
  }

  const addLearningItem = () => {
    setCourseForm((prev) => ({
      ...prev,
      whatToLearn: [...(prev.whatToLearn || []), '']
    }))
  }

  const updateLearningItem = (index: number, value: string) => {
    setCourseForm((prev) => ({
      ...prev,
      whatToLearn: prev.whatToLearn.map((item, i) => i === index ? value : item)
    }))
  }

  const removeLearningItem = (index: number) => {
    setCourseForm((prev) => ({
      ...prev,
      whatToLearn: prev.whatToLearn.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        {isEditing ? 'Փոփոխել դասընթացը' : 'Նոր դասընթաց'}
      </h3>

      <form onSubmit={onSubmit} className="space-y-6 w-full">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Դասընթացի վերնագիր <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={courseForm.title}
            onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Օրինակ՝ Wildberries-ում շահութաբեր ապրանք գտնելու մեթոդներ"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Category & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Կատեգորիա</label>
            <select
              value={courseForm.category}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            >
              <option value="">Ընտրեք կատեգորիան</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Լեզու</label>
            <select
              value={courseForm.language}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            >
              <option value="">Ընտրեք լեզուն</option>
              {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
            </select>
          </div>
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Գին (դրամ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={courseForm.price}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="180000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Զեղչ (%)</label>
            <input
              type="number"
              value={courseForm.discount}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, discount: e.target.value }))}
              placeholder="15"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Նկարագրություն <span className="text-red-500">*</span>
          </label>
          <textarea
            value={courseForm.description}
            onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Դասընթացի մանրամասն նկարագրությունը..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none transition-colors"
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Դասընթացի պատկեր</label>
          <div className="space-y-4">
            {(imagePreview || courseForm.image) && (
              <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={imagePreview || courseForm.image || ''}
                  alt="Course thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setCourseForm((prev) => ({ ...prev, image: null })) }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {isEditing && editingCourseVideoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoFrameSelectorOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 text-violet-700 font-medium rounded-xl hover:bg-violet-100 transition-colors border border-violet-200"
                >
                  <Camera className="w-4 h-4" />
                  Ընտրել վիդեոյի կադր
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isEditing && editingCourseVideoUrl
                ? 'Վերբեռնեք նկար կամ ընտրեք կադր առաջին վիդեոյից'
                : 'Վերբեռնեք դասընթացի պատկերը (առաջարկվող չափս՝ 1280x720)'}
            </p>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Պահանջվող գիտելիքներ</label>
          <div className="space-y-2">
            {(courseForm.prerequisites || []).map((prereq: string, index: number) => (
              <div key={`prereq-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  placeholder={`Պահանջվող գիտելիք ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPrerequisite}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ավելացնել պահանջվող գիտելիք
            </button>
          </div>
        </div>

        {/* What to Learn */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Ինչ կսովորեք</label>
          <div className="space-y-2">
            {(courseForm.whatToLearn || []).map((item: string, index: number) => (
              <div key={`learn-${index}`} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateLearningItem(index, e.target.value)}
                  placeholder={`Ուսումնառության արդյունք ${index + 1}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeLearningItem(index)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLearningItem}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ավելացնել ուսումնառության արդյունք
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl"
          >
            Չեղարկել
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            Պահպանել
          </button>
        </div>
      </form>

      <VideoFrameSelector
        isOpen={videoFrameSelectorOpen}
        videoUrl={editingCourseVideoUrl || ''}
        onFrameCapture={handleFrameCapture}
        onClose={() => setVideoFrameSelectorOpen(false)}
      />
    </div>
  )
}
