import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { createClient } from '@supabase/supabase-js'
import { hashApiKey } from '@/lib/api-keys'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  const hashedKey = hashApiKey(key)
  const rateLimit = RATE_LIMITS[plan]
  
  const now = new Date()
  const windowStart = new Date(now.getTime() - 60000) // 1 minute ago

  // Update rate limit counters using Supabase
  const { data, error } = await supabase
    .from('api_usage')
    .upsert([
      {
        api_key_id: hashedKey,
        rate_limit_count: 1,
        rate_limit_window: now.toISOString(),
        last_used: now.toISOString()
      }
    ], {
      onConflict: 'api_key_id',
      count: 'rate_limit_count + 1'
    })
    .select('rate_limit_count')
    .single()

  if (error) {
    console.error('Rate limit error:', error)
    return false
  }

  return data.rate_limit_count <= rateLimit
}

async function updateUsage(key: string) {
  const hashedKey = hashApiKey(key)

  // Increment usage count in Supabase
  const { error } = await supabase
    .from('api_usage')
    .upsert([
      {
        api_key_id: hashedKey,
        count: 1,
        last_used: new Date().toISOString()
      }
    ], {
      onConflict: 'api_key_id',
      count: 'count + 1'
    })

  if (error) {
    console.error('Usage update error:', error)
  }
}

export async function middleware(req: Request) {
  const { pathname } = new URL(req.url)

  // Public routes bypass checks
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // API key routes
  if (isApiKeyRoute(pathname)) {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return new NextResponse('API key required', { status: 401 })
    }

    // Verify API key and get plan using Supabase
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('plan')
      .eq('key', hashApiKey(apiKey))
      .single()

    if (!keyData) {
      return new NextResponse('Invalid API key', { status: 401 })
    }

    // Check rate limit
    const withinLimit = await checkRateLimit(apiKey, keyData.plan)
    if (!withinLimit) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    }

    // Update usage
    await updateUsage(apiKey)
    return NextResponse.next()
  }

  // Protected routes use session auth
  if (isProtectedRoute(pathname)) {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}