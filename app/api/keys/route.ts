import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/api-keys'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // First get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const { name } = await request.json()
    const { key, hashedKey, prefix } = generateApiKey()

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
      key: key // Return the unhashed key
    })
  } catch (error: unknown) {
    console.error('API Key creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await request.json()
    await prisma.apiKey.delete({
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