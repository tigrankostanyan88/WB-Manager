'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createBillingPortalForCurrentUser(): Promise<string | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      redirect('/login')
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.url
  } catch {
    return null
  }
}
