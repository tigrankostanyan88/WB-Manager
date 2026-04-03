// tabs/modules/ModuleForm.tsx - Module create/edit form with video management

'use client'

import { useState } from 'react'
import { X, Upload, Check, Edit, Trash2 } from 'lucide-react'
import type { ModuleItem, ModuleFile, CourseOption } from '@/hooks/admin/modules/types'
import { ModuleVideoThumbnail } from '@/components/features/admin/components/ModuleVideoThumbnail'
import { VideoPlayerModal } from '@/components/shared'

interface ModuleFormProps {
  moduleForm: { title: string; description: string; courseId: string }
  setModuleForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; courseId: string }>>
  courses: CourseOption[]
  editingId: string | null
  currentModuleVideos: ModuleFile[]
  videoFile: File | null
  isUploadingVideo: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  onVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadVideo: () => void
  onDeleteVideo: (videoId: string) => void
  onUpdateVideo: (videoId: string, title: string) => void
  getVideoUrl: (file: ModuleFile) => string
}

export function ModuleForm({
  moduleForm,
  setModuleForm,
  courses,
  editingId,
  currentModuleVideos,
  videoFile,
  isUploadingVideo,
  onSubmit,
  onCancel,
  onVideoFileChange,
  onUploadVideo,
  onDeleteVideo,
  onUpdateVideo,
  getVideoUrl,
}: ModuleFormProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [editingVideoTitle, setEditingVideoTitle] = useState('')

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        {editingId ? 'Փոփոխել մոդուլը' : 'Նոր մոդուլ'}
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Դասընթաց</label>
          <select
            value={moduleForm.courseId}
            onChange={(e) => setModuleForm((prev) => ({ ...prev, courseId: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Ընտրեք դասընթացը</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Անվանում</label>
          <input
            type="text"
            value={moduleForm.title}
            onChange={(e) => setModuleForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        {/* Video Section */}
        {editingId ? (
          <div className="border-t border-slate-200 pt-6 mt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Վիդեոներ</h4>

            {/* Current Videos List */}
            {currentModuleVideos.length > 0 && (
              <div className="space-y-3 mb-6">
                {currentModuleVideos.map((video, index) => (
                  <div key={video.id} className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                    <ModuleVideoThumbnail
                      videoUrl={getVideoUrl(video)}
                      onClick={() => setPlayingVideo(getVideoUrl(video))}
                    />

                    <div className="flex-1 min-w-0">
                      {editingVideoId === video.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingVideoTitle}
                            onChange={(e) => setEditingVideoTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateVideo(video.id, editingVideoTitle)
                                setEditingVideoId(null)
                              }
                              if (e.key === 'Escape') {
                                setEditingVideoId(null)
                                setEditingVideoTitle('')
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateVideo(video.id, editingVideoTitle)
                              setEditingVideoId(null)
                            }}
                            disabled={isUploadingVideo}
                            className="p-1 hover:bg-violet-100 text-violet-600 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVideoId(null)
                              setEditingVideoTitle('')
                            }}
                            className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer group/title"
                          onClick={() => {
                            setEditingVideoId(video.id)
                            setEditingVideoTitle(video.title || `Վիդեո ${index + 1}`)
                          }}
                        >
                          <p className="text-sm font-medium text-slate-700 truncate group-hover/title:text-violet-600 transition-colors">
                            {video.title || `Վիդեո ${index + 1}`}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {video.name}{video.ext}
                          </p>
                        </div>
                      )}
                    </div>

                    {editingVideoId !== video.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVideoId(video.id)
                          setEditingVideoTitle(video.title || `Վիդեո ${index + 1}`)
                        }}
                        disabled={isUploadingVideo}
                        className="p-2 hover:bg-violet-100 text-slate-400 hover:text-violet-600 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteVideo(video.id)}
                      disabled={isUploadingVideo}
                      className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Video */}
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <input
                  type="file"
                  accept="video/*"
                  onChange={onVideoFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50 transition-all cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {videoFile ? videoFile.name : 'Ընտրել վիդեո'}
                  </span>
                </div>
              </label>

              {videoFile && (
                <button
                  type="button"
                  onClick={onUploadVideo}
                  disabled={isUploadingVideo}
                  className="px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {isUploadingVideo ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Վերբեռնել'
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Հուշում:</span> Մոդուլը ստեղծելուց հետո կարող եք վիդեո ավելացնել։
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
          >
            Չեղարկել
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            {editingId ? 'Պահպանել' : 'Ստեղծել'}
          </button>
        </div>
      </form>

      {playingVideo && (
        <VideoPlayerModal
          videoUrl={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </div>
  )
}
