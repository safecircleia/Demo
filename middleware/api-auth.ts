import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashApiKey } from '@/lib/api-keys'

export async function apiAuthMiddleware(request: Request) {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const apiKey = authHeader.slice(7) // Remove 'Bearer ' prefix
  const hashedKey = hashApiKey(apiKey)

  try {
    const keyData = await prisma.apiKey.update({
      where: { key: hashedKey },
      data: {
        lastUsed: new Date(),
        usageCount: { increment: 1 }
      }
    })

    if (!keyData.enabled || keyData.usageCount > keyData.usageLimit) {
      return new NextResponse('API key disabled or limit exceeded', { status: 403 })
    }

    return NextResponse.next()
  } catch (error) {
    return new NextResponse('Invalid API key', { status: 401 })
  }
}