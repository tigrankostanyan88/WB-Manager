'use client'

import type { Lang } from '@/lib/i18n'

export function LangSwitcher({ current }: { current: Lang }) {
  const setLang = (lang: Lang) => {
    document.cookie = `lang=${lang}; path=/`
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1 text-[11px] font-medium">
      <button
        type="button"
        onClick={() => setLang('en')}
        className={
          current === 'en'
            ? 'px-2 py-1 rounded-full bg-white text-[#050016]'
            : 'px-2 py-1 rounded-full text-slate-300 hover:text-white'
        }
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('hy')}
        className={
          current === 'hy'
            ? 'px-2 py-1 rounded-full bg-white text-[#050016]'
            : 'px-2 py-1 rounded-full text-slate-300 hover:text-white'
        }
      >
        HY
      </button>
    </div>
  )
}

