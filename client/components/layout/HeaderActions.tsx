'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface HeaderActionsProps {
  onOpenLoginModal: () => void
  onOpenCourseModal: () => void
  mobile?: boolean
  onMobileLinkClick?: () => void
}

// User with avatar/files type definition
interface UserWithAvatar {
  avatar?: string
  files?: Array<{
    name_used?: string
    name?: string
    ext?: string
    table_name?: string
  }>
}

// Type guard for avatar/files access
function getAvatarUrl(user: UserWithAvatar | null): string {
  if (!user) return ''
  
  if (typeof user.avatar === 'string' && user.avatar) {
    return user.avatar
  }
  
  const files = Array.isArray(user.files) ? user.files : []
  const fileObj = files.find((x) => x.name_used === 'user_img') || files[0]
  if (!fileObj) return ''
  
  const table = fileObj.table_name || 'users'
  return `/images/${table}/large/${fileObj.name}.${fileObj.ext}`
}

export function HeaderActions({ onOpenLoginModal, onOpenCourseModal, mobile, onMobileLinkClick }: HeaderActionsProps) {
  const { user, isLoggedIn, isLoaded } = useAuth()
  const [avatarOverride, setAvatarOverride] = useState<string>('')

  const avatarUrl = (() => {
    if (avatarOverride) return avatarOverride
    const typedUser = user as UserWithAvatar | null
    const path = getAvatarUrl(typedUser)
    if (!path) return ''

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
    const withOrigin = (p: string) => {
      if (/^https?:\/\//i.test(apiBase)) {
        const origin = apiBase.replace(/\/api.*$/, '')
        return `${origin}${p}`
      }
      const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
      return `${prefix}${p}`
    }
    return withOrigin(path)
  })()

  if (mobile) {
    if (!isLoaded) {
      return (
        <div className="flex flex-col gap-4">
          <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
      )
    }

    if (isLoggedIn) {
      return (
        <div className="flex flex-col gap-4">
          <Link 
            href="/profile" 
            className="flex items-center gap-3 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
            onClick={onMobileLinkClick}
          >
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-violet-600" />
            </div>
            Պրոֆիլ
          </Link>
          {(!user?.isPaid && user?.role !== 'student') && (
            <Button 
              onClick={() => {
                onOpenCourseModal()
                onMobileLinkClick?.()
              }}
              className="w-full bg-slate-900"
            >
              Գրանցվել
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => {
            onOpenCourseModal()
            onMobileLinkClick?.()
          }}
          className="w-full bg-slate-900"
        >
          Գրանցվել
        </Button>
        <button 
          onClick={() => {
            onOpenLoginModal()
            onMobileLinkClick?.()
          }}
          className="text-center text-slate-600 font-bold py-2"
        >
          Մուտք
        </button>
      </div>
    )
  }

  // Desktop view
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-12 h-10 bg-slate-100 rounded-full animate-pulse"></div>
        <div className="w-24 h-10 bg-slate-100 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <>
        <div className="flex items-center gap-3">
          <Link href="/profile" prefetch={true} title="Պրոֆիլ">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] shadow-lg shadow-violet-100 hover:scale-110 transition-transform active:scale-95">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img key={avatarUrl} src={avatarUrl} alt={user?.name || 'avatar'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-violet-600" />
                )}
              </div>
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Բարև,</span>
            <span className="text-sm font-bold text-slate-900 leading-none">{user?.name?.split(' ')[0] || 'Ուսանող'}</span>
          </div>
        </div>
        {(!user?.isPaid && user?.role !== 'student') && (
          <Button  
            onClick={onOpenCourseModal}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:scale-105 px-6"
          >
            Գրանցվել
          </Button>
        )}
      </>
    )
  }

  return (
    <>
      <button 
        onClick={onOpenLoginModal}
        className="text-slate-600 hover:text-violet-600 font-semibold text-sm px-4 py-2 transition-colors"
      >
        Մուտք
      </button>
      
      <Button  
        onClick={onOpenCourseModal}
        className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:scale-105 px-6"
      >
        Գրանցվել
      </Button>
    </>
  )
}
