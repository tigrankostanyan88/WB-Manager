'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Camera, LogOut, User as UserIcon, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'

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
function getAvatarFromUser(user: SidebarUser | null): string {
  if (!user) return ''
  
  if (typeof user.avatar === 'string' && user.avatar) {
    return user.avatar
  }
  
  const files = Array.isArray(user.files) ? user.files : []
  const fileObj =
    files.find((x) => x.name_used === 'user_img') || files[0]
  if (!fileObj) return ''
  const table = fileObj.table_name || 'users'
  const path = `/images/${table}/large/${fileObj.name}.${fileObj.ext}`
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
  onShowPaymentModal: () => void
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
  onShowPaymentModal,
  onLogout
}: ProfileSidebarProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarUpload(file)
    }
    e.target.value = ''
  }, [onAvatarUpload])

  const avatarUrl = avatarPreview || getAvatarFromUser(user)

  return (
    <aside className="space-y-6 self-start mt-8">
      <Card className="shadow-2xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white backdrop-blur-xl border border-white/60">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="relative w-28 h-28 rounded-[2rem] bg-slate-100 p-1 shadow-sm transition-all duration-500 group-hover:scale-[1.02]">
                <div className="w-full h-full rounded-[1.6rem] bg-white flex items-center justify-center overflow-hidden border-2 border-slate-50 relative">
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
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-[#FF0000] transition-all border border-slate-100 cursor-pointer z-20">
                <Camera className="w-4.5 h-4.5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <div className="mt-6 space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || 'Օգտատեր'}</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{user?.role || 'Ուսանող'}</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) =>
              link.href ? (
                <motion.div key={link.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={link.href}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-black transition-all duration-300 group/link',
                      'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/link:bg-white group-hover/link:shadow-sm transition-all">
                        <link.icon className="w-4.5 h-4.5 text-slate-400 group-hover/link:text-violet-600" />
                      </div>
                      {link.label}
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
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-black transition-all duration-300 group/btn',
                    activeTab === link.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                        activeTab === link.id ? 'bg-white/10' : 'bg-slate-50 group-hover/btn:bg-white group-hover/btn:shadow-sm'
                      )}
                    >
                      <link.icon className={cn('w-4.5 h-4.5', activeTab === link.id ? 'text-white' : 'text-slate-400 group-hover/btn:text-violet-600')} />
                    </div>
                    {link.label}
                  </div>
                  {link.count !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest',
                        activeTab === link.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover/btn:bg-violet-100 group-hover/btn:text-violet-600 transition-colors'
                      )}
                    >
                      {link.count}
                    </span>
                  )}
                </motion.button>
              )
            )}

            <div className="pt-3 mt-3 border-t border-slate-50">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-black text-red-500 hover:bg-red-50 transition-all duration-300 group/logout active:scale-95"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover/logout:bg-white group-hover/logout:shadow-sm transition-all">
                  <LogOut className="w-4.5 h-4.5" />
                </div>
                Դուրս գալ
              </button>
            </div>
          </nav>
        </CardContent>
      </Card>
    </aside>
  )
}
