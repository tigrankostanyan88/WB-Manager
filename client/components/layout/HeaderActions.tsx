'use client'

import { useState, useEffect } from 'react'
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

export default function HeaderActions({ onOpenLoginModal, onOpenCourseModal, mobile, onMobileLinkClick }: HeaderActionsProps) {
  const { user, isLoggedIn, isLoaded } = useAuth()
  const [avatarOverride, setAvatarOverride] = useState<string>('')

  const avatarUrl = (() => {
    if (avatarOverride) return avatarOverride
    const u = user as unknown as { avatar?: unknown; files?: unknown } | null
    if (!u) return ''
    if (typeof u.avatar === 'string' && u.avatar) return u.avatar
    const files = Array.isArray(u.files) ? (u.files as unknown[]) : []
    const fileObj =
      files.find((x) => {
        if (!x || typeof x !== 'object') return false
        const rec = x as Record<string, unknown>
        return rec.name_used === 'user_img'
      }) || files[0]
    if (!fileObj || typeof fileObj !== 'object') return ''
    const f = fileObj as Record<string, unknown>
    if (typeof f.name !== 'string' || typeof f.ext !== 'string') return ''
    const table = typeof f.table_name === 'string' && f.table_name ? f.table_name : 'users'
    const path = `/images/${table}/large/${f.name}.${f.ext}`
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

  useEffect(() => {
    const handler = (evt: Event) => {
      const u = (evt as CustomEvent<{ user?: unknown }>).detail?.user as unknown
      if (!u) return
      const rec = u && typeof u === 'object' ? (u as Record<string, unknown>) : null
      if (!rec) return
      if (typeof rec.avatar === 'string' && rec.avatar) {
        setAvatarOverride(rec.avatar)
        return
      }
      const files = Array.isArray(rec.files) ? (rec.files as unknown[]) : []
      const fileObj =
        files.find((x) => {
          if (!x || typeof x !== 'object') return false
          const f = x as Record<string, unknown>
          return f.name_used === 'user_img'
        }) || files[0]
      if (fileObj && typeof fileObj === 'object') {
        const f = fileObj as Record<string, unknown>
        if (typeof f.name !== 'string' || typeof f.ext !== 'string') return
        const table = typeof f.table_name === 'string' && f.table_name ? f.table_name : 'users'
        const path = `/images/${table}/large/${f.name}.${f.ext}`
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
        const withOrigin = (p: string) => {
          if (/^https?:\/\//i.test(apiBase)) {
            const origin = apiBase.replace(/\/api.*$/, '')
            return `${origin}${p}`
          }
          const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
          return `${prefix}${p}`
        }
        setAvatarOverride(`${withOrigin(path)}?t=${Date.now()}`)
      }
    }
    window.addEventListener('auth:updated', handler as EventListener)
    return () => window.removeEventListener('auth:updated', handler as EventListener)
  }, [])

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
          <Link href="/profile" title="Պրոֆիլ">
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
