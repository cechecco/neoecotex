import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { usersService } from './lib/server/database'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('middleware')
  const pathname = request.nextUrl.pathname
  let user
  try {
    user = await usersService.get()
  } catch (error) {
    user = null
  }
  if (pathname.startsWith('/innovations')) {
    if (!user) {
      const response = NextResponse.redirect(new URL('/registration', request.url))
      return response
    } else if (!user.active) {
      const response = NextResponse.redirect(new URL('/account/edit', request.url))
      return response
    }
  }
  if (pathname.startsWith('/registration') && user) {
    const response = NextResponse.redirect(new URL('/innovations/requests', request.url))
    return response
  }
  const response = NextResponse.next()
  return response
}
export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}
