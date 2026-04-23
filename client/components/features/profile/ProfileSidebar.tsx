'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Camera, LogOut, User as UserIcon, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCallback, useMemo } from 'react'

interface SidebarLink {
  id: string
  label: string
  icon: LucideIcon
  count?: number
  href?: string
}

interface SidebarUser {
  name?: string | null
  role?: string | null
  avatar?: string | null
  files?: Array<{
    name_used?: string
    table_name?: string
    name?: string
    ext?: string
  }> | null
}

// Type guard for avatar/files access
function getAvatarFromUser(user: SidebarUser | null, cacheBust?: number): string {
  if (!user) return ''
  
  if (typeof user.avatar === 'string' && user.avatar) {
    // Add cache-busting if avatar doesn't already have it
    if (cacheBust && !user.avatar.includes('?t=')) {
      return `${user.avatar}?t=${cacheBust}`
    }
    return user.avatar
  }
  
  const files = Array.isArray(user.files) ? user.files : []
  const fileObj =
    files.find((x) => x.name_used === 'user_img') || files[0]
  if (!fileObj || !fileObj.name) return ''
  const table = fileObj.table_name || 'users'
  // ext already includes the leading dot from backend (e.g., '.jpg')
  const ext = fileObj.ext || ''
  const extWithDot = ext.startsWith('.') ? ext : `.${ext}`
  let path = `/images/${table}/large/${fileObj.name}${extWithDot}`
  // Add cache-busting to prevent stale cached images
  if (cacheBust) {
    path += `?t=${cacheBust}`
  }
  return path
}

interface ProfileSidebarProps {
  user: SidebarUser
  activeTab: string
  isUploadingAvatar: boolean
  avatarPreview?: string | null
  sidebarLinks: SidebarLink[]
  onTabChange: (tab: string) => void
  onAvatarUpload: (file: File) => void
  onLogout: () => void
}

export function ProfileSidebar({
  user,
  activeTab,
  isUploadingAvatar,
  avatarPreview,
  sidebarLinks,
  onTabChange,
  onAvatarUpload,
  onLogout
}: ProfileSidebarProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarUpload(file)
    }
    e.target.value = ''
  }, [onAvatarUpload])

  // Generate cache-busting timestamp on mount to prevent stale images
  const cacheBust = useMemo(() => Date.now(), [user?.files?.length])
  
  const avatarUrl = avatarPreview || getAvatarFromUser(user, cacheBust)

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 self-start">
      <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="relative">
        {/* Decorative background gradient blobs */}
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-violet-300/40 to-purple-300/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gradient-to-tr from-emerald-300/30 to-teal-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
        
        <Card className="relative shadow-2xl shadow-violet-200/30 rounded-2xl overflow-hidden bg-gradient-to-br from-white via-slate-50/80 to-violet-50/60 backdrop-blur-xl border border-white/80">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,#6366f1_1px,transparent_0)] bg-[length:20px_20px]" />
          
          <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="relative group cursor-pointer">
              <div className="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-violet-100 to-slate-100 p-1.5 shadow-lg shadow-slate-200/50 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-violet-200/40">
                <div className="w-full h-full rounded-[1.6rem] bg-white flex items-center justify-center overflow-hidden border-2 border-white relative shadow-inner">
                  {isUploadingAvatar ? (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0000]" />
                    </div>
                  ) : null}
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt={user?.name || 'User'} 
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute -bottom-1 -right-1 w-10 h-10 rounded-xl bg-white shadow-lg shadow-slate-300/50 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:shadow-violet-200/60 transition-all duration-300 border border-slate-100 cursor-pointer z-20 group/camera">
                <Camera className="w-5 h-5 transition-transform group-hover/camera:scale-110" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <div className="mt-5 space-y-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{user?.name || 'Օգտատեր'}</h2>
              <div className="flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{user?.role === 'admin' ? 'Ադմին' : 'Ուսանող'}</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-0.5 sm:space-y-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] rounded-xl p-1.5 sm:p-2 bg-white/50">
            {sidebarLinks.map((link) =>
              link.href ? (
                <motion.div key={link.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={link.href}
                    className={cn(
                      'w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-[13px] font-black transition-all duration-300 group/link',
                      'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover/link:bg-white group-hover/link:shadow-sm transition-all flex-shrink-0">
                        <link.icon className="w-4.5 h-4.5 text-slate-400 group-hover/link:text-violet-600" />
                      </div>
                      <span className="text-left truncate">{link.label}</span>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-[13px] font-black transition-all duration-300 group/btn',
                    activeTab === link.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                        activeTab === link.id ? 'bg-white/10' : 'bg-white border border-slate-100 group-hover/btn:border-slate-200'
                      )}
                    >
                      <link.icon className={cn('w-4.5 h-4.5', activeTab === link.id ? 'text-white' : 'text-slate-400 group-hover/btn:text-violet-600')} />
                    </div>
                    <span className="text-left truncate">{link.label}</span>
                  </div>
                  {link.count !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest',
                        activeTab === link.id ? 'bg-white/20 text-white' : 'bg-white border border-slate-100 text-slate-400 group-hover/btn:border-slate-200 transition-colors'
                      )}
                    >
                      {link.count}
                    </span>
                  )}
                </motion.button>
              )
            )}

            <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-50">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-[13px] font-black text-red-500 hover:bg-red-50 transition-all duration-300 group/logout active:scale-95"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover/logout:bg-white group-hover/logout:shadow-sm transition-all flex-shrink-0">
                  <LogOut className="w-4.5 h-4.5" />
                </div>
                <span className="truncate">Դուրս գալ</span>
              </button>
            </div>
          </nav>
        </CardContent>
      </Card>
      </div>
      </div>
    </aside>
  )
}
