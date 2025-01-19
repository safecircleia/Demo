import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the token using the secret
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Debug log (will appear in Vercel logs)
  console.log('Middleware token:', token)
  console.log('Path:', request.nextUrl.pathname)

  if (request.nextUrl.pathname.startsWith('/demo')) {
    if (!token || token.accountType !== "parent") {
      // Redirect unauthenticated users to login page
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/demo/:path*',
    '/auth/login'  // Add this to handle login redirects
  ]
}