// tabs/instructor/InstructorPhoto.tsx - Instructor photo upload component

import { User, Camera } from 'lucide-react'

interface InstructorPhotoProps {
  avatarUrl: string
  name: string
  profession: string
  onAvatarFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function InstructorPhoto({ avatarUrl, name, profession, onAvatarFileSelect }: InstructorPhotoProps) {
  return (
    <div className="bg-slate-50 p-6 flex flex-col">
      <div className="relative flex-1 min-h-[380px] flex items-center justify-center">
        {avatarUrl ? (
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
            <img
              src={avatarUrl}
              alt="Մենթոր"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-lg">{name || 'Անուն'}</p>
              <p className="text-white/80 text-sm">{profession || 'Մասնագիտություն'}</p>
            </div>
          </div>
        ) : (
          <label className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all group">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors">
              <User className="w-10 h-10 text-slate-400 group-hover:text-violet-500 transition-colors" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Ավելացնել նկար</span>
            <span className="text-xs text-slate-400 mt-1">3:4 հարաբերակցություն</span>
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarFileSelect}
              className="hidden"
            />
          </label>
        )}

        {avatarUrl && (
          <label className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarFileSelect}
              className="hidden"
            />
            <Camera className="w-5 h-5 text-slate-600" />
          </label>
        )}
      </div>
    </div>
  )
}
