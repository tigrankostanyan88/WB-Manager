import { ImageResponse } from 'next/og'
import { getApiOrigin } from '@/lib/apiUrl'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

async function getSettings() {
  try {
    const origin = getApiOrigin()
    const res = await fetch(`${origin}/api/v1/settings`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return data?.settings || {}
    }
  } catch {}
  return {}
}

async function fetchLogoAsBuffer(logoUrl: string): Promise<Buffer | null> {
  try {
    const res = await fetch(logoUrl, { cache: 'no-store' })
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }
  } catch {}
  return null
}

export default async function Icon() {
  const settings = await getSettings()
  
  // Try to use custom logo if available
  if (settings.logo) {
    const origin = getApiOrigin()
    const logoUrl = settings.logo.startsWith('http') 
      ? settings.logo 
      : `${origin}${settings.logo.startsWith('/') ? '' : '/'}${settings.logo}`
    
    const logoBuffer = await fetchLogoAsBuffer(logoUrl)
    
    if (logoBuffer) {
      // Convert buffer to data URL
      const base64 = logoBuffer.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`
      
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              borderRadius: '8px',
            }}
          >
            <img
              src={dataUrl}
              width={24}
              height={24}
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
        ),
        {
          ...size,
        }
      )
    }
  }
  
  // Fallback to default hourglass icon
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          borderRadius: '8px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v2.5l-3 3-3-3V3h6Z"/>
          <path d="M18 3v2.5l-3 3-3-3V3h6Z"/>
          <path d="M12 21v-2.5l3-3 3 3V21h-6Z"/>
          <path d="M6 21v-2.5l3-3 3 3V21H6Z"/>
          <path d="M12 8.5 9 12l3 3.5 3-3.5-3-3.5Z"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
