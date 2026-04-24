import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ConfirmProvider } from '@/components/providers/ConfirmProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { PageTransition } from '@/components/shared/PageTransition'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/lib/auth'
import type { User } from '@/lib/auth'
import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { JwtPayloadSchema } from '@/lib/schemas'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
  let title = 'WB Mastery - Wildberries դասընթացներ հայերենով'
  let description = 'Սովորեք Wildberries վաճառք և մենեջմենթ՝ քայլ առ քայլ դասընթացներով։ Դարձեք պրոֆեսիոնալ մենեջեր, մասշտաբավորեք ձեր բիզնեսը և ստացեք կայուն եկամուտ։ 2500+ ուսանողներ, 1200+ հաջողված վաճառողներ։'
  let ogImage: string | null = null

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
          ogImage = url
        }
      }
    }
  } catch {}

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.savaa.am'

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      locale: 'hy_AM',
      url: siteUrl,
      siteName: title,
      title,
      description,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: siteUrl,
    },
    keywords: ['Wildberries', 'վաճառք', 'մենեջեր', 'դասընթացներ', 'մարկետպլեյս', 'հեռավար ուսուցում', 'e-commerce', 'օնլայն խանութ', 'Վայլդբերրիս', 'մասնագիտական դասընթաց', 'առևտուր', 'բիզնես', 'ռուսաստան', 'առցանց վաճառք'],
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
        const s = data.settings
        if (s.logo && !s.logo.startsWith('http')) {
           s.logo = `${origin}${s.logo}`
           if (s.logo.startsWith('/images/')) {
             s.logo = `${origin}${s.logo}`
           }
        }
        return s
      }
    }
  } catch {
    // Fail silently in production
  }
  return {}
}

async function getUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    if (!token) {
      console.log('[Server] No JWT cookie found')
      return null
    }

    const decoded = decodeJwt(token)
    const jwtResult = JwtPayloadSchema.safeParse(decoded)
    if (!jwtResult.success) {
      console.log('[Server] JWT validation failed:', jwtResult.error)
      return null
    }
    
    const userId = jwtResult.data.id || jwtResult.data.sub
    if (!userId) {
      console.log('[Server] No userId in JWT')
      return null
    }

    // Fetch user from backend API using /me endpoint (same as client-side)
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300').replace(/\/+$/, '')
      const url = `${apiBase}/api/v1/users/me`
      console.log('[Server] Fetching user from:', url)
      
      const res = await fetch(url, {
        headers: { Cookie: `jwt=${token}` },
        cache: 'no-store'
      })
      
      if (!res.ok) {
        console.log('[Server] User fetch failed:', res.status, res.statusText)
        return null
      }
      
      const userData = await res.json()
      console.log('[Server] User fetched successfully:', userData?.data?.user?.id || userData?.data?.id)
      // Handle both {data: {user: {...}}} and {data: {...}} formats
      return userData?.data?.user || userData?.data || null
    } catch (err) {
      console.log('[Server] Error fetching user:', err)
      return null
    }
  } catch (err) {
    console.log('[Server] Error in getUser:', err)
  }
  return null
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Fetch settings and user in parallel with timeout and error handling
  let settings = {}
  let user = null
  
  try {
    const [settingsResult, userResult] = await Promise.allSettled([
      getSettings(),
      getUser()
    ])
    
    if (settingsResult.status === 'fulfilled') {
      settings = settingsResult.value
    }
    
    if (userResult.status === 'fulfilled') {
      user = userResult.value
    }
  } catch {
    // Fallback for any truly unhandled errors
    settings = {}
    user = null
  }

  return (
    <html lang="hy" suppressHydrationWarning style={{ backgroundColor: '#ffffff' }} className={`${inter.variable}`}>
      <body className={`${inter.variable} font-sans pt-16`}>
        <LenisProvider>
          <QueryProvider>
            <AuthProvider initialUser={user as User | null}>
              <SettingsProvider initialSettings={settings}>
                <ConfirmProvider>
                  <HeaderWrapper />
                  <PageTransition>
                    {children}
                  </PageTransition>
                  <ScrollToTop />
                  <ToastProvider />
                </ConfirmProvider>
              </SettingsProvider>
            </AuthProvider>
          </QueryProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
