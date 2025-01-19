import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  // Allow auth-related endpoints
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isProtectedRoute = ['/dashboard', '/demo', '/profile'].some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  // Allow passkey operations to proceed
  if (req.nextUrl.searchParams.has('action')) {
    return NextResponse.next()
  }

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}