export const fixLarge = (p?: string) => {
  if (!p || typeof p !== 'string') return p
  if (p.includes('/insotrutors/') && !p.includes('/insotrutors/large/')) {
    return p.replace('/insotrutors/', '/insotrutors/large/')
  }
  if (p.includes('/instructors/') && !p.includes('/instructors/large/')) {
    return p.replace('/instructors/', '/instructors/large/')
  }
  return p
}

export const withOrigin = (p?: string) => {
  if (!p || typeof p !== 'string') return p
  if (p.startsWith('/images/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    if (!apiBase) return p
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api.*$/, '')
      return `${origin}${p}`
    }
    return p
  }
  return p
}

