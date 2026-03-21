'use client'

// CoursesTab Component - Manages course listing and course creation/editing form
// Includes: Course list view, Add/Edit course form with prerequisites and learning outcomes

import { useState, useCallback } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Play,
  BookOpen,
  Clock,
  Tag,
  Video
} from 'lucide-react'
import type { Course } from '../../_hooks/useCourses'

import { ConfirmProvider, useConfirm } from '@/components/providers/ConfirmProvider'

interface CoursesTabProps {
  showCourseForm: boolean
  courseForm: {
    title: string
    category: string
    description: string
    price: string
    language: string
    discount: string
    image: string | null
    prerequisites: string[]
    whatToLearn: string[]
  }
  setCourseForm: React.Dispatch<React.SetStateAction<any>>
  startNewCourse: () => void
  editCourse: (course: Course) => void
  deleteCourse: (id: string) => Promise<void>
  cancelNewCourse: () => void
  submitCourse: (e: React.FormEvent) => Promise<void>
  courses: Course[]
  isLoading: boolean
  onImageFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  addLearningPoint: () => void
  changeLearningPoint: (index: number, value: string) => void
  removeLearningPoint: (index: number) => void
  getCourseFirstVideoUrl: (course: Course) => string | null
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

export default function CoursesTab({
  showCourseForm,
  courseForm,
  setCourseForm,
  startNewCourse,
  editCourse,
  deleteCourse,
  cancelNewCourse,
  submitCourse,
  courses,
  isLoading,
  onImageFileSelect,
  getCourseFirstVideoUrl
}: CoursesTabProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'pricing'>('basic')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const confirm = useConfirm()

  const handleDelete = async (course: Course) => {
    const confirmed = await confirm({
      title: 'Ջնջել դասընթացը',
      message: `Վստա՞հ եք, որ ցանկանում եք ջնջել "${course.title}" դասընթացը:`,
      confirmText: 'Ջնջել',
      cancelText: 'Չեղարկել',
      tone: 'danger'
    })
    
    if (confirmed) {
      await deleteCourse(course._id || String(course.id))
    }
  }

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      onImageFileSelect(e)
    }
  }, [onImageFileSelect])

  const addPrerequisite = () => {
    setCourseForm((prev: any) => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), '']
    }))
  }

  const updatePrerequisite = (index: number, value: string) => {
    setCourseForm((prev: any) => ({
      ...prev,
      prerequisites: prev.prerequisites.map((p: string, i: number) => i === index ? value : p)
    }))
  }

  const removePrerequisite = (index: number) => {
    setCourseForm((prev: any) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_: string, i: number) => i !== index)
    }))
  }

  const addLearningItem = () => {
    setCourseForm((prev: any) => ({
      ...prev,
      whatToLearn: [...(prev.whatToLearn || []), '']
    }))
  }

  const updateLearningItem = (index: number, value: string) => {
    setCourseForm((prev: any) => ({
      ...prev,
      whatToLearn: prev.whatToLearn.map((item: string, i: number) => i === index ? value : item)
    }))
  }

  const removeLearningItem = (index: number) => {
    setCourseForm((prev: any) => ({
      ...prev,
      whatToLearn: prev.whatToLearn.filter((_: string, i: number) => i !== index)
    }))
  }

  if (showCourseForm) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Նոր դասընթաց</h3>
        
        <div className="space-y-6 w-full">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Դասընթացի վերնագիր <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => setCourseForm((prev: any) => ({ ...prev, title: e.target.value }))}
              placeholder="Օրինակ՝ Wildberries-ում շահութաբեր ապրանք գտնելու մեթոդներ"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Category & Language - Side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Կատեգորիա
              </label>
              <select
                value={courseForm.category}
                onChange={(e) => setCourseForm((prev: any) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              >
                <option value="">Ընտրեք կատեգորիան</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Լեզու
              </label>
              <select
                value={courseForm.language}
                onChange={(e) => setCourseForm((prev: any) => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              >
                <option value="">Ընտրեք լեզուն</option>
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
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
                onChange={(e) => setCourseForm((prev: any) => ({ ...prev, price: e.target.value }))}
                placeholder="180000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Զեղչ (%)
              </label>
              <input
                type="number"
                value={courseForm.discount}
                onChange={(e) => setCourseForm((prev: any) => ({ ...prev, discount: e.target.value }))}
                placeholder="15"
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
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
              onChange={(e) => setCourseForm((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Դասընթացի մանրամասն նկարագրությունը..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none transition-all"
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Պահանջվող գիտելիքներ
            </label>
            <div className="space-y-2">
              {(courseForm.prerequisites || []).map((prereq: string, index: number) => (
                <div key={`prereq-${index}-${prereq.slice(0, 5)}`} className="flex gap-2">
                  <input
                    type="text"
                    value={prereq}
                    onChange={(e) => updatePrerequisite(index, e.target.value)}
                    placeholder={`Պահանջվող գիտելիք ${index + 1}`}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
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
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Ինչ կսովորեք
            </label>
            <div className="space-y-2">
              {(courseForm.whatToLearn || []).map((item: string, index: number) => (
                <div key={`learn-${index}-${item.slice(0, 5)}`} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateLearningItem(index, e.target.value)}
                    placeholder={`Ուսումնառության արդյունք ${index + 1}`}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
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
              onClick={cancelNewCourse}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Չեղարկել
            </button>
            <button
              type="button"
              onClick={submitCourse}
              className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              Պահպանել
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Դասընթացներ</h2>
          <p className="text-sm text-slate-500 mt-1">Կառավարեք ձեր դասընթացները և բովանդակությունը</p>
        </div>
        <button
          onClick={startNewCourse}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          <Plus className="w-5 h-5" />
          Ավելացնել
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course._id || course.id} 
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden"
            >
              {/* Video/Image Thumbnail Area */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {(() => {
                  const videoUrl = getCourseFirstVideoUrl(course)
                  if (videoUrl) {
                    return (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        preload="metadata"
                        muted
                        playsInline
                        onLoadedMetadata={(e) => {
                          const video = e.currentTarget
                          const seekTime = Math.min(45, video.duration / 2 || 0)
                          if (seekTime > 0) video.currentTime = seekTime
                        }}
                      />
                    )
                  }
                  if (course.image) {
                    return (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  }
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-violet-400" />
                      </div>
                    </div>
                  )
                })()}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play className="w-7 h-7 text-violet-600 ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Category Badge */}
                {course.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full shadow-sm">
                      {course.category}
                    </span>
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-300">
                    {course.price} դր.
                  </span>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-violet-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Video className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {course.modules?.length || 0} մոդուլ
                    </span>
                  </div>
                  {course.language && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Tag className="w-4 h-4" />
                      <span className="text-xs font-medium">{course.language}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => editCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Փոփոխել
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Դասընթացներ չկան</h3>
          <p className="text-sm text-slate-500 mt-1">Ավելացրեք ձեր առաջին դասընթացը</p>
          <button
            onClick={startNewCourse}
            className="mt-4 px-6 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            Ավելացնել դասընթաց
          </button>
        </div>
      )}
    </div>
  )
}
