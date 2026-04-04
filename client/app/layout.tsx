import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { ConfirmProvider } from '@/components/providers/ConfirmProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { AuthProvider } from '@/lib/auth'
import type { User } from '@/lib/auth'
import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { prisma } from '@/lib/db'
import { JwtPayloadSchema, DbUserSchema, SettingsSchema } from '@/lib/schemas'

// Database User type from Prisma (minimal fields needed)
interface DbUser {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  address?: string | null
  role?: string | null
  avatar?: string | null
  isPaid?: boolean | null
  files?: { name_used?: string; name?: string; ext?: string; table_name?: string }[] | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

// Using web fonts via <link> to avoid SWC-native requirement during dev on Windows

export async function generateMetadata(): Promise<Metadata> {
  let title = 'AI Tools SaaS'
  let icons: Metadata['icons'] = undefined
  try {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
    const origin = /^https?:\/\//.test(base) ? base.replace(/\/api\/?$/, '') : base
    const res = await fetch(`${origin}/api/v1/settings`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data?.settings) {
        if (data.settings.siteName) title = data.settings.siteName
        if (data.settings.logo) {
          const url = data.settings.logo.startsWith('http') 
            ? data.settings.logo 
            : `${origin}${data.settings.logo}`
          icons = { icon: url }
        }
      }
    }
  } catch {}

  return {
    title,
    description: 'Production-ready AI Tools SaaS with Next.js 14',
    icons,
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

async function getSettings() {
  try {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
    const origin = /^https?:\/\//.test(base) ? base.replace(/\/api\/?$/, '') : base
    const res = await fetch(`${origin}/api/v1/settings`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data?.settings) {
        // Apply withOrigin logic here since we are on server
        const s = data.settings
        if (s.logo && !s.logo.startsWith('http')) {
           s.logo = `${origin}${s.logo}`
           // Actually, let's just ensure it is correct. 
           // If logo starts with /images, prepend base.
           if (s.logo.startsWith('/images/')) {
             s.logo = `${origin}${s.logo}`
           }
        }
        return s
      }
    }
  } catch (err) {
    // Graceful degradation - log error but don't crash the app
    if (process.env.NODE_ENV === 'development') {
      console.error('[getSettings] Failed to fetch settings:', err)
    }
  }
  return {}
}

async function getUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('jwt')?.value
    if (!token) return null

    const decoded = decodeJwt(token)
    const jwtResult = JwtPayloadSchema.safeParse(decoded)
    if (!jwtResult.success) return null
    
    const userId = jwtResult.data.id || jwtResult.data.sub
    if (!userId) return null

    if (!process.env.DATABASE_URL) return null

    const dbUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!dbUser) return null
    
    const userResult = DbUserSchema.safeParse(dbUser)
    if (!userResult.success) return null
    
    const fullUser = userResult.data
    
    return {
      ...fullUser,
      createdAt: fullUser.createdAt?.toISOString(),
      updatedAt: fullUser.updatedAt?.toISOString(),
      name: fullUser.name || '',
      phone: fullUser.phone || '',
      address: fullUser.address || '',
      role: fullUser.role || 'user',
      avatar: fullUser.avatar || '',
      isPaid: fullUser.isPaid || false,
      course_ids: fullUser.course_ids || [],
      files: fullUser.files || []
    }
  } catch (err) {
    // Graceful degradation for auth errors - user will be treated as logged out
    if (process.env.NODE_ENV === 'development') {
      console.error('[getUser] Auth error:', err)
    }
  }
  return null
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  const user = await getUser()

  return (
    <html lang="hy">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body style={{ fontFamily: '"Noto Sans Armenian", Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
        <LenisProvider>
          <QueryProvider>
            <AuthProvider initialUser={user as User | null}>
              <SettingsProvider initialSettings={settings}>
                <ConfirmProvider>
                  {children}
                  <ScrollToTop />
                </ConfirmProvider>
              </SettingsProvider>
            </AuthProvider>
          </QueryProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
