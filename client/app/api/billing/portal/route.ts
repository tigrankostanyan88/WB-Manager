import { createBillingPortalForCurrentUser } from '@/app/(dashboard)/settings/server'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const url = await createBillingPortalForCurrentUser()
    if (!url) {
      return new Response(JSON.stringify({ error: 'No portal URL created' }), { status: 500 })
    }
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
