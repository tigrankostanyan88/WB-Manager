// lib/i18n.ts - Internationalization types and utilities

export type Lang = 'hy' | 'en' | 'ru'

export const defaultLang: Lang = 'hy'

export const languages: Record<Lang, string> = {
  hy: 'Հայերեն',
  en: 'English',
  ru: 'Русский',
}

export function getLangFromCookie(): Lang {
  if (typeof document === 'undefined') return defaultLang
  const match = document.cookie.match(/lang=([^;]+)/)
  return (match?.[1] as Lang) || defaultLang
}

export function setLangCookie(lang: Lang) {
  document.cookie = `lang=${lang};path=/;max-age=31536000`
}
