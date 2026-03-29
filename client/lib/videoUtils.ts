export function buildVideoUrl(name: string, ext: string): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const origin = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
  const dot = ext.startsWith('.') ? '' : '.'
  return `${origin}/files/modules/${name}${dot}${ext}`
}

export function getApiOrigin(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  return /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/api.*$/, '') : ''
}
