// landing/contact/SocialLinks.tsx - Social media links component

import type { Settings } from './types'

const SOCIAL_LINKS = [
  {
    key: 'instagram' as const,
    gradient: 'from-yellow-400 via-red-500 to-purple-500',
    shadow: 'shadow-pink-500',
    svg: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    key: 'facebook' as const,
    bg: 'bg-[#1877F2]',
    shadow: 'shadow-blue-500',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    key: 'telegram' as const,
    bg: 'bg-[#229ED9]',
    shadow: 'shadow-sky-500',
    svg: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
  },
  {
    key: 'whatsapp' as const,
    bg: 'bg-[#25D366]',
    shadow: 'shadow-green-500',
    svg: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M16.95 14.4c-.39-.2-2.3-1.14-2.66-1.27-.36-.13-.62-.2-.88.2s-1.01 1.27-1.24 1.53-.46.29-.85.1c-.39-.19-1.64-.6-3.13-1.93-1.15-1.03-1.92-2.3-2.15-2.69-.23-.39-.02-.6.17-.79.17-.17.39-.45.58-.68.19-.23.25-.39.38-.64.13-.25.07-.47-.03-.66-.11-.19-.97-2.34-1.33-3.2-.35-.85-.71-.74-.97-.75-.25-.01-.54-.01-.84-.01-.3 0-.79.11-1.2.56-.41.45-1.57 1.53-1.57 3.74 0 2.21 1.61 4.35 1.84 4.66.23.31 3.16 4.83 7.66 6.77 2.67 1.15 3.21.92 3.79.86.58-.06 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.3-.21-.69-.41z" />
      </>
    ),
  },
] as const

interface SocialLinksProps {
  settings: Settings
}

export function SocialLinks({ settings }: SocialLinksProps) {
  return (
    <div className="pt-4">
      <h3 className="font-semibold text-gray-900 mb-4">Սոցիալական մեդիա</h3>
      <div className="flex gap-4">
        {SOCIAL_LINKS.map((social) => {
          const link = settings[social.key] as string | undefined
          if (!link) return null

          const isInstagram = social.key === 'instagram'
          const className = isInstagram
            ? `flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr ${social.gradient} text-white shadow-lg ${social.shadow}/20 hover:${social.shadow}/30 hover:scale-110 transition-all duration-300`
            : `flex h-11 w-11 items-center justify-center rounded-full ${social.bg} text-white shadow-lg ${social.shadow}/20 hover:${social.shadow}/30 hover:scale-110 transition-all duration-300`

          return (
            <a
              key={social.key}
              href={link}
              target="_blank"
              rel="noreferrer nofollow"
              className={className}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {social.svg}
              </svg>
            </a>
          )
        })}
      </div>
    </div>
  )
}
