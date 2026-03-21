'use client'

import { Plus, Edit, Trash2, Play, X, Upload, Film, Video, Clock, BookOpen, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ModuleItem, ModuleFile, CourseOption } from '../../_hooks/useModules'

// Video Thumbnail Component - shows actual video preview with play button
function VideoThumbnail({ videoUrl, onClick }: { videoUrl: string; onClick: () => void }) {
  console.log('VideoThumbnail rendered with URL:', videoUrl)
  
  return (
    <div 
      className="relative w-24 h-16 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
      onClick={() => {
        console.log('VideoThumbnail clicked, URL:', videoUrl)
        onClick()
      }}
    >
      {/* Video Preview */}
      <video
        src={videoUrl}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={(e) => {
          const video = e.currentTarget
          const seekTime = Math.min(45, video.duration / 2 || 0)
          if (seekTime > 0) {
            video.currentTime = seekTime
          }
        }}
      />
      
      {/* Play Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 text-violet-600 ml-0.5" fill="currentColor" />
        </div>
      </div>
    </div>
  )
}

// Video Player Modal
function VideoPlayerModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  console.log('VideoPlayerModal rendering with URL:', videoUrl)
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full aspect-video"
          onError={(e) => console.error('Video error:', e)}
        />
      </div>
    </div>
  )
}

// Helper function to format duration
function formatDuration(duration: string): string {
  if (!duration) return '00:00'
  const parts = duration.split(':')
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return `${minutes}:${seconds}`
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    if (hours === '00') return `${minutes}:${seconds}`
    return `${hours}:${minutes}:${seconds}`
  }
  return duration
}

// Helper function to convert duration to minutes
function durationToMinutes(duration: string): number {
  if (!duration) return 0
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60
  }
  return 0
}

// Helper function to get video count from module
function getVideoCount(module: ModuleItem): number {
  return module.files?.filter(f => f.name_used === 'module_video').length || 0
}

// Helper function to get total video duration in a module
function getTotalVideoDuration(module: ModuleItem): number {
  // For now, use the module's duration field which represents total content duration
  // In the future, this could calculate from individual video file durations if available
  return durationToMinutes(module.duration)
}

// Helper function to format minutes to hours and minutes
function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0 րոպե'
  if (minutes < 60) return `${Math.round(minutes)} րոպե`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) return `${hours} ժամ`
  return `${hours} ժ ${mins} ր`
}

interface ModulesTabProps {
  showModuleForm: boolean
  moduleForm: { title: string; description: string; courseId: string }
  setModuleForm: React.Dispatch<React.SetStateAction<any>>
  allModules: ModuleItem[]
  courses: CourseOption[]
  isLoading: boolean
  editingId: string | null
  startNewModule: () => void
  editModule: (module: ModuleItem) => void
  cancelNewModule: () => void
  submitModule: (e: React.FormEvent) => Promise<void>
  deleteModule: (id: string) => void
  videoFile: File | null
  isUploadingVideo: boolean
  currentModuleVideos: ModuleFile[]
  deleteModuleVideo: (videoId: string) => void
  updateModuleVideo: (videoId: string, title: string) => void
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadModuleVideo: () => void
  getVideoUrl: (file: ModuleFile) => string
  reorderVideos?: (moduleId: string, videoIds: string[]) => void
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
  deleteModule,
  videoFile,
  isUploadingVideo,
  currentModuleVideos,
  deleteModuleVideo,
  updateModuleVideo,
  handleVideoFileChange,
  uploadModuleVideo,
  getVideoUrl
}: ModulesTabProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [editingVideoTitle, setEditingVideoTitle] = useState('')
  console.log('ModulesTab rendering, playingVideo:', playingVideo)
  
  if (showModuleForm) {
    console.log('Rendering form view, editingId:', editingId)
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
                <option key={course.id} value={course.id}>{course.title}</option>
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
          {/* Video Section - Show message when creating new module, show upload when editing */}
          {editingId ? (
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Վիդեոներ</h4>
              
              {/* Current Videos List */}
              {currentModuleVideos.length > 0 && (
                <div className="space-y-3 mb-6">
                  {currentModuleVideos.map((video, index) => (
                    <div key={video.id} className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                      {/* Video Thumbnail - 45th second frame */}
                      <VideoThumbnail 
                        videoUrl={getVideoUrl(video)} 
                        onClick={() => setPlayingVideo(getVideoUrl(video))}
                      />
                      
                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        {editingVideoId === video.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingVideoTitle}
                              onChange={(e) => setEditingVideoTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateModuleVideo(video.id, editingVideoTitle)
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
                                updateModuleVideo(video.id, editingVideoTitle)
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
                      
                      {/* Edit Button */}
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
                      
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteModuleVideo(video.id)}
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
                    onChange={handleVideoFileChange}
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
                    onClick={uploadModuleVideo}
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
        {playingVideo && (
          <VideoPlayerModal 
            videoUrl={playingVideo} 
            onClose={() => setPlayingVideo(null)} 
          />
        )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allModules.map((module) => {
            const videoCount = getVideoCount(module)
            const totalDurationMinutes = getTotalVideoDuration(module)
            const courseName = courses.find(c => c.id === module.courseId)?.title || 'Unknown course'
            
            return (
              <div 
                key={module.id} 
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden"
              >
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
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {module.description || 'Նկարագրություն չկա'}
                  </p>
                  
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
                      onClick={() => editModule(module)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-violet-50 hover:text-violet-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Փոփոխել
                    </button>
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Մոդուլներ չկան</h3>
          <p className="text-sm text-slate-500 mt-1">Ավելացրեք ձեր առաջին մոդուլը</p>
          <button
            onClick={startNewModule}
            className="mt-4 px-6 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            Ավելացնել մոդուլ
          </button>
        </div>
      )}
      {playingVideo && (
        <VideoPlayerModal 
          videoUrl={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </div>
  )
}
