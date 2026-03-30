'use client'

import type { User } from '../../types'
import { withOrigin } from '../../_utils/image'

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
  if (!avatarFile) return null
  const path = `/images/users/large/${avatarFile.name}.${avatarFile.ext}`
  return withOrigin(path) || null
}
