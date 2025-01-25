import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isBetaUser: true,
        betaFeatures: {
          createMany: {
            data: [
              { featureId: 'ai-advanced' },
              { featureId: 'real-time' },
              { featureId: 'custom-rules' }
            ]
          }
        }
      },
      include: {
        betaFeatures: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Beta enrollment error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        betaFeatures: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Beta status fetch error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isBetaUser: false,
        betaFeatures: {
          deleteMany: {} // This will remove all beta features for the user
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Beta removal error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}