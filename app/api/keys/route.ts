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
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized: User ID required', { status: 401 })
    }

    const { id } = await request.json()
    await prisma.apiKey.deleteMany({
      where: {
        id,
        userId: session.user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: unknown) {
    console.error('API Key deletion error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 })
  }
}