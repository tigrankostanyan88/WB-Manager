'use client'

import Link from 'next/link'
import { useSettings } from '@/lib/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 pt-10">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          <div className="space-y-4 col-span-2 md:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              {settings.logo ? (
                <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-violet-200">
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 3v2.5l-3 3-3-3V3h6Z"/><path d="M18 3v2.5l-3 3-3-3V3h6Z"/><path d="M12 21v-2.5l3-3 3 3V21h-6Z"/><path d="M6 21v-2.5l3-3 3 3V21H6Z"/><path d="M12 8.5 9 12l3 3.5 3-3.5-3-3.5Z"/></svg>
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-slate-900 break-words">{settings.siteName || 'WB Manager'}</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Wildberries-ում հաջողության հասնելու լավագույն հարթակը: Ստեղծված է որակի և մասշտաբավորման համար:
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Ծրագիր</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/#curriculum" className="hover:text-violet-600 transition-colors">Ուսուցում</Link></li>
              <li><Link href="/#mentors" className="hover:text-violet-600 transition-colors">Մենթորներ</Link></li>
              <li><Link href="/#features" className="hover:text-violet-600 transition-colors">Առավելություններ</Link></li>
              <li><Link href="/#impact" className="hover:text-violet-600 transition-colors">Արդյունքներ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Ընկերություն</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-violet-600 transition-colors">Մեր մասին</Link></li>
              <li><Link href="#" className="hover:text-violet-600 transition-colors">Կապ</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-600 transition-colors">ՀՏՀ</Link></li>
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="font-bold text-slate-900">Իրավական</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-violet-600 transition-colors">Գաղտնիության քաղաքականություն</Link></li>
              <li><Link href="#" className="hover:text-violet-600 transition-colors">Օգտագործման պայմաններ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} WB Mastery. Բոլոր իրավունքները պաշտպանված են:</p>
        </div>
      </div>
    </footer>
  )
}
