// hooks/modules/utils.ts - Module helper functions

import { getApiOrigin } from '@/lib/apiUrl'
import type { ModuleFile, ModuleItem } from './types'

export const mapModule = (m: unknown): ModuleItem => {
  const mm = m as {
    id?: unknown
    title?: unknown
    duration?: unknown
    course_id?: unknown
    courseId?: unknown
    files?: unknown[]
  }
  return {
    id: String(mm?.id ?? ''),
    title: String(mm?.title ?? ''),
    duration: String(mm?.duration ?? ''),
    courseId: String(mm?.course_id ?? mm?.courseId ?? ''),
    files: Array.isArray(mm?.files)
      ? mm.files.map((f: unknown) => {
          const ff = f as {
            id?: unknown
            name?: unknown
            ext?: unknown
            title?: unknown
            name_used?: unknown
            table_name?: unknown
          }
          return {
            id: String(ff?.id ?? ''),
            name: String(ff?.name ?? ''),
            ext: String(ff?.ext ?? ''),
            title: String(ff?.title ?? ''),
            name_used: String(ff?.name_used ?? ''),
            table_name: String(ff?.table_name ?? ''),
          }
        })
      : [],
  }
}

export const parseModules = (data: unknown): ModuleItem[] => {
  const arr = Array.isArray(data) ? data : []
  return arr.map(mapModule)
}

export function formatDuration(duration: string): string {
  if (!duration) return '00:00'
  const parts = duration.split(':')
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return `${minutes}:${seconds}`
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    if (hours === '00') return `${minutes}:${seconds}`
    return `${hours}:${minutes}:${seconds}`
  }
  return duration
}

export function durationToMinutes(duration: string): number {
  if (!duration) return 0
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60
  }
  return 0
}

export function getVideoCount(module: ModuleItem): number {
  return module.files?.filter(f => f.name_used === 'module_video').length || 0
}

export function getTotalVideoDuration(module: ModuleItem): number {
  return durationToMinutes(module.duration || '')
}

export function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0 րոպե'
  if (minutes < 60) return `${Math.round(minutes)} րոպե`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) return `${hours} ժամ`
  return `${hours} ժ ${mins} ր`
}

export function getVideoUrl(file: ModuleFile): string {
  const origin = getApiOrigin()
  return `${origin}/files/modules/${file.name}${file.ext}`
}
