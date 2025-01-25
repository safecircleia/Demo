import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getRateLimit } from '@/lib/rate-limit'

export const config = {
  matcher: ['/api/:path*']
}

// Create rate limiter middleware
async function rateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  const { success, remaining } = await getRateLimit(ip, 100, "60")

  if (!success) {
    return new NextResponse(JSON.stringify({
      error: "Too Many Requests",
      message: "Please try again later"
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': remaining.toString()
      }
    })
  }

  return NextResponse.next()
}

// Main middleware
export default auth(async function middleware(request) {
  // Apply rate limiting to API routes
  if (request.url.includes('/api/')) {
    return rateLimit(request)
  }

  const { nextUrl } = request
  const session = await auth()
  const isLoggedIn = !!session?.user
  const isAuthPage = nextUrl.pathname.startsWith('/auth')
  const isOnboardingPage = nextUrl.pathname === '/auth/onboarding'

  // Allow auth endpoints
  if (nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect to onboarding if needed
  if (isLoggedIn && !isOnboardingPage && !isAuthPage) {
    const user = session.user
    // Check both session and DB onboarding status
    if (user?.onboardingComplete === false) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { onboardingStatus: true }
      })
      
      // Only redirect if both session and DB show incomplete onboarding
      if (!dbUser?.onboardingStatus?.completed) {
        return NextResponse.redirect(new URL('/auth/onboarding', nextUrl))
      }
    }
  }

  // Handle other auth redirects
  if (isAuthPage && isLoggedIn && !isOnboardingPage) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})