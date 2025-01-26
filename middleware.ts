import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'
import { hashApiKey } from '@/lib/api-keys'

// Rate limits per minute
const RATE_LIMITS = {
  free: 100,
  pro: 500,
  premium: 2000,
} as const

// Monthly quotas
const MONTHLY_QUOTAS = {
  free: 10000,
  pro: 50000,
  premium: 200000,
} as const

// Route configurations
const PUBLIC_ROUTES = [
  '/api/auth/',    // Auth endpoints
  '/api/version',   // Version endpoint
  '/api/changelog',
  '/api/roadmap'
]

const PROTECTED_ROUTES = [
  '/api/user/',
  '/api/settings/',
  '/api/family/',
  '/api/beta/',
  '/api/keys/',
  '/api/passkeys/',
  '/api/profile',
  '/api/predict',
]

const API_KEY_ROUTES = [
  '/api/predict'
]

// Helper functions
const isPublicRoute = (pathname: string) => 
  PUBLIC_ROUTES.some(route => pathname.startsWith(route))

const isProtectedRoute = (pathname: string) => 
  PROTECTED_ROUTES.some(route => pathname.startsWith(route))

const isApiKeyRoute = (pathname: string) => 
  API_KEY_ROUTES.some(route => pathname.startsWith(route))

async function checkRateLimit(key: string, plan: 'free' | 'pro' | 'premium') {
  const now = new Date()
  const minute = now.getMinutes()
  const rateLimitKey = `${key}-${minute}`

  const rateLimit = await prisma.rateLimit.upsert({
    where: { id: rateLimitKey },
    create: {
      id: rateLimitKey,
      key,
      count: 1,
      type: 'api',
      expiresAt: new Date(now.getTime() + 60 * 1000)
    },
    update: {
      count: {
        increment: 1
      }
    }
  })

  const limit = RATE_LIMITS[plan]
  return {
    success: rateLimit.count <= limit,
    remaining: Math.max(0, limit - rateLimit.count),
    limit
  }
}

export const config = {
  matcher: ['/api/:path*']
}

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url)
  
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (apiKey && API_KEY_ROUTES.some(route => pathname.startsWith(route))) {
    try {
      const hashedKey = hashApiKey(apiKey)
      
      const result = await prisma.$transaction(async (tx) => {
        // First find the key
        const existingKey = await tx.apiKey.findFirst({
          where: { 
            key: hashedKey,
            enabled: true 
          },
          include: {
            user: {
              select: { 
                subscriptionPlan: true 
              }
            }
          }
        })

        if (!existingKey) {
          throw new Error('Invalid API key')
        }

        // Update usage statistics
        const currentMonth = new Date()
        currentMonth.setDate(1)
        currentMonth.setHours(0, 0, 0, 0)

        await tx.apiKey.update({
          where: { id: existingKey.id },
          data: {
            lastUsed: new Date(),
            usageCount: { increment: 1 },
            usage: {
              upsert: {
                where: {
                  apiKeyId_month: {
                    apiKeyId: existingKey.id,
                    month: currentMonth
                  }
                },
                create: {
                  month: currentMonth,
                  count: 1
                },
                update: {
                  count: { increment: 1 }
                }
              }
            }
          }
        })

        return existingKey
      })

      // Check rate limits
      const rateLimit = await checkRateLimit(result.key, result.user.subscriptionPlan as 'free' | 'pro' | 'premium')
      if (!rateLimit.success) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded',
          limit: rateLimit.limit,
          remaining: rateLimit.remaining
        }, { status: 429 })
      }

      return NextResponse.next()

    } catch (error) {
      console.error('API key validation error:', error)
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 401 })
    }
  }

  const session = await auth()
  const isLoggedIn = !!session?.user

  // Handle API key routes
  if (API_KEY_ROUTES.some(route => pathname.startsWith(route))) {
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
    if (apiKey) {
      // API key validation logic
      try {
        const hashedApiKey = hashApiKey(apiKey)
        const keyData = await prisma.apiKey.findUnique({
          where: { key: hashedApiKey },
          include: {
            user: { select: { subscriptionPlan: true } }
          }
        })

        if (!keyData || !keyData.enabled) {
          return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
        }

        // Rate limit check for API keys
        const rateLimit = await checkRateLimit(keyData.key, keyData.user.subscriptionPlan as 'free' | 'pro' | 'premium')
        if (!rateLimit.success) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
        }

        return NextResponse.next()
      } catch (error) {
        console.error('API key validation error:', error)
        return NextResponse.json({ error: 'Authentication failed, API key required for this endpoint' }, { status: 500 })
      }
    }
  }

  // Allow access if user is logged in
  if (isLoggedIn) {
    return NextResponse.next()
  }

  // Reject if no valid auth
  return NextResponse.json({ error: 'Web Authentication required, or no api key provided' }, { status: 401 })
}