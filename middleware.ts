import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // Protect /demo routes
  if (request.nextUrl.pathname.startsWith('/demo')) {
    if (!token) {
      // Redirect unauthenticated users to login page
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }
    // Allow authenticated users to access the demo
    return NextResponse.next()
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/demo/:path*'
  ]
}