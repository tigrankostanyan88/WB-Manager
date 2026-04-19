// landing/contact/SocialLinks.tsx - Social media links component

import { Instagram, Facebook, Send, MessageCircle } from 'lucide-react'
import type { Settings } from './types'

const SOCIAL_LINKS = [
  {
    key: 'instagram' as const,
    icon: Instagram,
    gradient: 'from-yellow-400 via-pink-500 to-purple-600',
    shadow: 'shadow-pink-500/30',
    label: 'Instagram',
  },
  {
    key: 'facebook' as const,
    icon: Facebook,
    gradient: 'from-blue-500 to-blue-700',
    shadow: 'shadow-blue-500/30',
    label: 'Facebook',
  },
  {
    key: 'telegram' as const,
    icon: Send,
    gradient: 'from-sky-400 to-sky-600',
    shadow: 'shadow-sky-500/30',
    label: 'Telegram',
  },
  {
    key: 'whatsapp' as const,
    icon: MessageCircle,
    gradient: 'from-green-400 to-emerald-600',
    shadow: 'shadow-green-500/30',
    label: 'WhatsApp',
  },
] as const

interface SocialLinksProps {
  settings: Settings
}

export function SocialLinks({ settings }: SocialLinksProps) {
  const visibleLinks = SOCIAL_LINKS.filter(social => settings[social.key] as string | undefined)
  
  if (visibleLinks.length === 0) return null

  return (
    <div className="relative p-4 sm:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] bg-gradient-to-br from-white to-slate-50 sm:from-white/60 sm:to-white/30 sm:backdrop-blur-xl shadow-lg shadow-violet-100/50 ring-1 ring-slate-100 sm:ring-white/80">
      <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </span>
        Սոցիալական մեդիա
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {visibleLinks.map((social) => {
          const link = settings[social.key] as string | undefined
          const Icon = social.icon
          
          return (
            <a
              key={social.key}
              href={link}
              target="_blank"
              rel="noreferrer nofollow"
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r ${social.gradient} ${social.shadow} shadow-lg text-white hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden`}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="font-medium text-xs sm:text-sm relative z-10">{social.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
