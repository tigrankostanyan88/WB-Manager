'use client'

import { Lock, Play } from 'lucide-react'

export interface VideoModule {
  id: string | number
  title: string
  thumbnail?: string
  duration: string
  fileName?: string
  isLocked: boolean
  onClick?: () => void
}

interface VideoModulesListProps {
  modules: VideoModule[]
}

export function VideoModulesList({ modules }: VideoModulesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Դասընթացի բովանդակությունը</h2>
      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={module.id || index}
            onClick={module.onClick}
            className={`
              flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm
              ${module.isLocked 
                ? 'cursor-not-allowed opacity-80' 
                : 'cursor-pointer hover:shadow-md hover:border-violet-300 transition-all'
              }
            `}
          >
            {/* Video Thumbnail */}
            <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-slate-900">
              {module.thumbnail ? (
                <img 
                  src={module.thumbnail} 
                  alt={module.title}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700" />
              )}
              
              {/* Play Button Overlay */}
              {!module.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                  </div>
                </div>
              )}
              
              {/* Duration Badge */}
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-bold text-white">
                {module.duration}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base mb-1 truncate">{module.title}</h3>
              <p className="text-sm text-slate-500">Տևողություն՝ {module.duration}</p>
              {module.fileName && (
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">
                  {module.fileName}
                </span>
              )}
            </div>

            {/* Lock Icon */}
            {module.isLocked && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
