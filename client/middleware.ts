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

  // In development, completely skip auth checks due to cross-port cookie issues
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] DEV BYPASS: ${pathname}`)
    return NextResponse.next()
  }

  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  const token = request.cookies.get('jwt')?.value

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
