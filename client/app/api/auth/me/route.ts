import { NextRequest } from 'next/server'
import { withAuth, forwardToBackend, getBackendUrl } from '../../lib/utils'

export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    const backendUrl = await getBackendUrl('/api/users/me')
    return forwardToBackend(token, backendUrl)
  })
}
