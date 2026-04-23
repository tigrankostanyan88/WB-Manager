'use client'

import type { User } from '@/components/features/admin/types'
import { withOrigin } from '@/components/features/admin/_utils/image'

export interface SuspendedUsersTabProps {
  users: User[]
  isLoading: boolean
  search: string
  setSearch: (value: string) => void
  onRestore: (id: number | string) => void
  onPermanentDelete: (id: number | string) => void
  onBulkDelete?: (ids: (number | string)[]) => void
}

export function getUserAvatarUrl(user: User): string | null {
  const files = user.files
  if (!files || !Array.isArray(files) || files.length === 0) return null
  const avatarFile = files.find((f) => f?.name_used === 'user_img')
  if (!avatarFile || !avatarFile.name || !avatarFile.ext) return null
  // ext already includes the leading dot from backend (e.g., '.jpg')
  const extWithDot = avatarFile.ext.startsWith('.') ? avatarFile.ext : `.${avatarFile.ext}`
  const path = `/images/users/large/${avatarFile.name}${extWithDot}`
  return withOrigin(path) || null
}
