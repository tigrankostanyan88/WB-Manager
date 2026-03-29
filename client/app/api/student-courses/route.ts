import { NextRequest } from 'next/server'
import { withAuth, forwardToBackend, getBackendUrl } from '../lib/utils'

export async function GET(req: NextRequest) {
  return withAuth(req, async (token) => {
    const backendUrl = await getBackendUrl('/api/student-courses')
    return forwardToBackend(token, backendUrl)
  })
}
