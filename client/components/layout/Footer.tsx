'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

export function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 mt-20 py-10 overflow-hidden">
      {/* Gradient overlay - contained to footer only */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-800/30 to-transparent pointer-events-none" />
      
      <div className="container relative z-10 py-16 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          <div className="space-y-4 col-span-2 md:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              {settings.logo ? (
                <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-slate-500/20 ring-1 ring-slate-500/30 relative">
                  <Image
                    src={settings.logo}
                    alt="Logo"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold shadow-lg shadow-slate-500/30 ring-1 ring-slate-400/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 3v2.5l-3 3-3-3V3h6Z"/><path d="M18 3v2.5l-3 3-3-3V3h6Z"/><path d="M12 21v-2.5l3-3 3 3V21h-6Z"/><path d="M6 21v-2.5l3-3 3 3V21H6Z"/><path d="M12 8.5 9 12l3 3.5 3-3.5-3-3.5Z"/></svg>
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-white">{settings.siteName || 'Sava.'}</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Wildberries-ում հաջողության հասնելու լավագույն հարթակը: Ստեղծված է որակի և մասշտաբավորման համար:
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-white">Ծրագիր</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/#curriculum" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Ուսուցում</Link></li>
              <li><Link href="/#mentors" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Մենթորներ</Link></li>
              <li><Link href="/#features" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Առավելություններ</Link></li>
              <li><Link href="/#impact" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Արդյունքներ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-white">Ընկերություն</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Մեր մասին</Link></li>
              <li><Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Կապ</Link></li>
              <li><Link href="/#faq" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">ՀՏՀ</Link></li>
            </ul>
          </div>
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="font-bold text-white">Իրավական</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Գաղտնիության քաղաքականություն</Link></li>
              <li><Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors duration-200">Օգտագործման պայմաններ</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar with gradient border */}
        <div className="mt-12 pt-8 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Sava. Բոլոր իրավունքները պաշտպանված են:
          </p>
        </div>
      </div>
    </footer>
  )
}
