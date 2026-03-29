import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/',
  '/course',
  '/course-details',
  '/pricing',
  '/api/v1/users/signUp',
  '/api/v1/users/signIn'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's a public route (exact match or starts with)
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
