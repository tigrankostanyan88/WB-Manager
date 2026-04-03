/**
 * Avatar utility functions for user profile images
 * Centralized avatar URL generation to avoid code duplication
 */

import { withOrigin } from '@/components/features/admin/_utils/image'

export interface AvatarFile {
  name_used?: string
  name?: string
  ext?: string
  table_name?: string
}

export interface UserWithFiles {
  files?: AvatarFile[] | null
}

/**
 * Build avatar URL from user files
 * Looks for 'user_img' name_used first, falls back to first file
 * @param user - User object with optional files array
 * @returns Full avatar URL or null if no avatar found
 */
export function getUserAvatarUrl(user: UserWithFiles | null | undefined): string | null {
  if (!user || !user.files || user.files.length === 0) return null

  const avatarFile = user.files.find((f) => f?.name_used === 'user_img')
  if (!avatarFile || !avatarFile.name || !avatarFile.ext) return null

  const table = avatarFile.table_name || 'users'
  const path = `/images/${table}/large/${avatarFile.name}.${avatarFile.ext}`
  return withOrigin(path) || null
}

/**
 * Build avatar URL from raw file data
 * @param files - Array of file objects
 * @returns Full avatar URL or null if no valid avatar
 */
export function getAvatarUrlFromFiles(files: AvatarFile[] | null | undefined): string | null {
  if (!files || files.length === 0) return null

  const avatarFile = files.find((f) => f?.name_used === 'user_img')
  if (!avatarFile || !avatarFile.name || !avatarFile.ext) return null

  const table = avatarFile.table_name || 'users'
  const path = `/images/${table}/large/${avatarFile.name}.${avatarFile.ext}`
  return withOrigin(path) || null
}

/**
 * Get the first available image from files
 * Useful for fallback avatars
 * @param files - Array of file objects
 * @param tableName - Default table name for path construction
 * @returns Full image URL or null
 */
export function getFirstImageUrl(
  files: AvatarFile[] | null | undefined,
  tableName: string = 'users'
): string | null {
  if (!files || files.length === 0) return null

  const file = files[0]
  if (!file.name || !file.ext) return null

  const table = file.table_name || tableName
  const path = `/images/${table}/large/${file.name}.${file.ext}`
  return withOrigin(path) || null
}
