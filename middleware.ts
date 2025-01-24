import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma' // Adjust the import path as necessary

export default auth(async (req) => {
  const { nextUrl } = req
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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}