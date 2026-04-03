'use client'

import Image from 'next/image'
import { Plus, Edit, Trash2, Play, BookOpen, Tag, Video } from 'lucide-react'
import type { Course } from '@/components/features/admin/types'
import { VideoThumbnail } from '@/components/features/admin/components/VideoThumbnail'

interface CourseListProps {
  courses: Course[]
  isLoading: boolean
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  onCreateNew: () => void
  getCourseFirstVideoUrl: (course: Course) => string | null
}

export function CourseList({
  courses,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
  getCourseFirstVideoUrl
}: CourseListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Դասընթացներ չկան</h3>
        <p className="text-sm text-slate-500 mt-1">Ավելացրեք ձեր առաջին դասընթացը</p>
        <button
          onClick={onCreateNew}
          className="mt-4 px-6 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          Ավելացնել դասընթաց
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Դասընթացներ</h2>
          <p className="text-sm text-slate-500 mt-1">Կառավարեք ձեր դասընթացները և բովանդակությունը</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          <Plus className="w-5 h-5" />
          Ավելացնել
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course._id || course.id}
            course={course}
            onEdit={onEdit}
            onDelete={onDelete}
            getCourseFirstVideoUrl={getCourseFirstVideoUrl}
          />
        ))}
      </div>
    </>
  )
}

// Course Card Sub-component
interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  getCourseFirstVideoUrl: (course: Course) => string | null
}

function CourseCard({ course, onEdit, onDelete, getCourseFirstVideoUrl }: CourseCardProps) {
  const videoUrl = getCourseFirstVideoUrl(course)
  const thumbnailTime = course.thumbnail_time

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden">
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {videoUrl ? (
          <VideoThumbnail
            videoUrl={videoUrl}
            timestamp={thumbnailTime}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-violet-400" />
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="w-7 h-7 text-violet-600 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Badges */}
        {course.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full shadow-sm">
              {course.category}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-300">
            {course.price} դր.
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-violet-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Video className="w-4 h-4" />
            <span className="text-xs font-medium">{course.modules?.length || 0} մոդուլ</span>
          </div>
          {course.language && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-medium">{course.language}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(course)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Փոփոխել
          </button>
          <button
            onClick={() => onDelete(course)}
            className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
