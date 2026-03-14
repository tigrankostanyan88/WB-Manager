'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import RegistrationModal from '@/components/modals/RegistrationModal'
import { cn } from '@/lib/utils'
import { useSettings } from '@/lib/SettingsContext'
import HeaderActions from '@/components/layout/HeaderActions'

export default function Header({ forceWhiteBackground = false }: { forceWhiteBackground?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldBeSolid = forceWhiteBackground || isScrolled

  const navLinks = [
    { href: '/#curriculum', label: 'Ծրագիր' },
    { href: '/#instructor', label: 'Դասավանդող' },
    { href: '/#features', label: 'Առավելություններ' },
    { href: '/#impact', label: 'Արդյունքներ' },
    { href: '/#faq', label: 'ՀՏՀ' },
  ]

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100 py-3"
        )}
      >
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 relative z-50 min-w-0">
              {settings.logo ? (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg shadow-violet-200 shrink-0">
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6"><path d="M12 3v2.5l-3 3-3-3V3h6Z"/><path d="M18 3v2.5l-3 3-3-3V3h6Z"/><path d="M12 21v-2.5l3-3 3 3V21h-6Z"/><path d="M6 21v-2.5l3-3 3 3V21H6Z"/><path d="M12 8.5 9 12l3 3.5 3-3.5-3-3.5Z"/></svg>
                </div>
              )}
              <span className="text-base sm:text-xl font-bold tracking-tight text-[#000000] truncate">
                {settings.siteName || 'WB Manager'}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-slate-600 transition-colors hover:text-[#502899] whitespace-nowrap text-xs xl:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <HeaderActions onOpenModal={() => setIsModalOpen(true)} />
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-1.5 sm:p-2 text-slate-600 shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 lg:hidden animate-in slide-in-from-top-5 duration-200">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="text-slate-600 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="border-slate-50" />
                  <HeaderActions 
                    mobile 
                    onOpenModal={() => setIsModalOpen(true)} 
                    onMobileLinkClick={() => setIsMobileMenuOpen(false)}
                  />
                </nav>
              </div>
            )}
      </header>
      <RegistrationModal isOpen={isModalOpen}  onClose={() => setIsModalOpen(false)} />
    </>
  )
}
