import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/api-keys'

type CreateApiKeyRequest = {
  name: string
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized: Email required', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const { name } = await request.json()
    const { key, hashedKey, prefix } = await generateApiKey()

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        keyPrefix: prefix,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return NextResponse.json({ 
      ...apiKey,
      key
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKeyId = searchParams.get('id')

    if (!apiKeyId) {
      return NextResponse.json({ error: 'API key ID required' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // Get API key and its usage
      const apiKey = await tx.apiKey.findUnique({
        where: { id: apiKeyId },
        include: { usage: true }
      })

      if (!apiKey) {
        throw new Error('API key not found')
      }

      // Aggregate usage stats to user level
      for (const usage of apiKey.usage) {
        await tx.userApiStats.upsert({
          where: {
            userId_month: {
              userId: apiKey.userId,
              month: usage.month
            }
          },
          update: {
            count: { increment: usage.count }
          },
          create: {
            userId: apiKey.userId,
            month: usage.month,
            count: usage.count
          }
        })
      }

      // Delete API key and its usage
      await tx.apiUsage.deleteMany({
        where: { apiKeyId }
      })
      
      await tx.apiKey.delete({
        where: { id: apiKeyId }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}

// Add cleanup job for old stats (can be run via cron)
async function cleanupOldStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  await prisma.userApiStats.deleteMany({
    where: {
      month: {
        lt: thirtyDaysAgo
      }
    }
  })
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: user.id
      },
      include: {
        usage: true
      }
    })

    return NextResponse.json(apiKeys)

  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' }, 
      { status: 500 }
    )
  }
}