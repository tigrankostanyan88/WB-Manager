import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function withAuth(
  req: NextRequest,
  handler: (token: string) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return await handler(token)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function forwardToBackend(
  token: string,
  backendUrl: string,
  options?: RequestInit
): Promise<NextResponse> {
  try {
    const res = await fetch(backendUrl, {
      ...options,
      headers: {
        ...options?.headers,
        'Cookie': `token=${token}`
      }
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      return NextResponse.json(error, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function getBackendUrl(path: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300'
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
