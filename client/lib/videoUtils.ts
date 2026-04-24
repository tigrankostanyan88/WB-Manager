import { getApiOrigin } from './apiUrl'

export function buildVideoUrl(name: string, ext: string): string {
  const origin = getApiOrigin()
  const dot = ext.startsWith('.') ? '' : '.'
  return `${origin}/files/modules/${name}${dot}${ext}`
}

export { getApiOrigin } from './apiUrl'
