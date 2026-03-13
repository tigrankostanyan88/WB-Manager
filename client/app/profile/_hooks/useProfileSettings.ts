import api, { userService } from '@/lib/api'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import type { ProfileUser } from './useProfileData'

interface PasswordData {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}

interface UseProfileSettingsParams {
  passwordData: PasswordData
  setPasswordData: (data: PasswordData) => void
  setShowPasswordModal: (open: boolean) => void
  setIsUploadingAvatar: (v: boolean) => void
  setAvatarPreview?: (url: string | null) => void
  setUser: (user: ProfileUser) => void
  setAuthUser: (user: ProfileUser | null) => void
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useProfileSettings({
  passwordData,
  setPasswordData,
  setShowPasswordModal,
  setIsUploadingAvatar,
  setAvatarPreview,
  setUser,
  setAuthUser,
  showToast
}: UseProfileSettingsParams) {
  const [isUpdating, setIsUpdating] = useState(false)

  const extractErrorMessage = (err: unknown): string | null => {
    if (!err || typeof err !== 'object') return null
    const resp = (err as { response?: unknown }).response
    if (!resp || typeof resp !== 'object') return null
    const data = (resp as { data?: unknown }).data
    if (!data || typeof data !== 'object') return null
    const msg = (data as { message?: unknown }).message
    return typeof msg === 'string' ? msg : null
  }

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)

    const formData = new FormData(e.currentTarget)
    const fields = ['name', 'email', 'phone', 'address'] as const
    const data: Record<string, string> = {}
    fields.forEach((k) => {
      const v = formData.get(k)
      if (v != null && String(v).trim() !== '') data[k] = String(v)
    })

    try {
      const res = await userService.updateMe(data)
      const nextUser = (res.data as { user: ProfileUser }).user
      setUser(nextUser)
      showToast('Պրոֆիլը հաջողությամբ թարմացվեց')
    } catch (err: unknown) {
      console.error('Error updating profile:', err)
      showToast(extractErrorMessage(err) || 'Սխալ պրոֆիլի թարմացման ժամանակ', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview?.(previewUrl)

    const formData = new FormData()
    formData.append('user_img', file)

    setIsUploadingAvatar(true)
    try {
      // Don't set Content-Type manually for FormData, axios/browser handles it with boundary
      const res = await api.patch('/api/v1/users/updateme', formData)
      const u = ((res.data as { user?: unknown })?.user || {}) as ProfileUser
      let avatar = u.avatar

      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api'
      const withOrigin = (path: string) => {
        if (/^https?:\/\//i.test(apiBase)) {
          const origin = apiBase.replace(/\/api.*$/, '')
          return `${origin}${path}`
        }
        const prefix = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
        return `${prefix}${path}`
      }

      if (typeof avatar === 'string' && avatar && /^\/[^/]/.test(avatar)) {
        avatar = `${withOrigin(avatar)}?t=${Date.now()}`
      } else if ((!avatar || typeof avatar !== 'string') && u.files && Array.isArray(u.files) && u.files.length) {
        const f = u.files.find((x) => x.name_used === 'user_img') || u.files[0]
        if (f && f.name && f.ext) {
          const p = `/images/${f.table_name || 'users'}/large/${f.name}.${f.ext}`
          avatar = `${withOrigin(p)}?t=${Date.now()}`
        }
      }
      
      // Clean up the blob URL to prevent memory leak
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      
      // Use server avatar URL instead of blob preview to avoid memory leaks
      if (avatar) {
        setAvatarPreview?.(avatar)
      }
      
      const updatedUser = { ...u, avatar }
      setUser(updatedUser)
      setAuthUser(updatedUser)
      try {
        window.dispatchEvent(new CustomEvent('auth:updated', { detail: { user: updatedUser } }))
      } catch {}
      showToast('Նկարը հաջողությամբ թարմացվեց')
    } catch (err: unknown) {
      console.error('Error uploading avatar:', err)
      showToast('Սխալ նկարի թարմացման ժամանակ', 'error')
      // Clean up the blob URL on error too
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    } finally {
      // Only revoke the blob URL after we've set the server URL
      // or if there was an error (to clean up memory)
      setIsUploadingAvatar(false)
    }
  }

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (passwordData.password !== passwordData.passwordConfirm) {
      showToast('Նոր գաղտնաբառերը չեն համընկնում', 'error')
      return
    }
    setIsUpdating(true)
    try {
      await userService.updatePassword(passwordData as unknown as Record<string, unknown>)
      setShowPasswordModal(false)
      setPasswordData({ passwordCurrent: '', password: '', passwordConfirm: '' })
      showToast('Գաղտնաբառը հաջողությամբ թարմացվեց')
    } catch (err: unknown) {
      console.error('Error updating password:', err)
      showToast(extractErrorMessage(err) || 'Սխալ գաղտնաբառի թարմացման ժամանակ', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  return { isUpdating, handleUpdateProfile, handleAvatarUpload, handleUpdatePassword }
}
