import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { step, accountType } = await req.json()

    // Validate step and accountType
    if (typeof step !== 'number' || !['parent', 'child'].includes(accountType)) {
      return new NextResponse('Invalid input', { status: 400 })
    }

    const onboarding = await prisma.onboardingStatus.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        step,
        completed: step === 2
      },
      create: {
        userId: session.user.id, // Now we know this is definitely defined
        step,
        completed: false
      }
    })

    // Update user account type separately
    await prisma.user.update({
      where: { id: session.user.id },
      data: { accountType }
    })

    return NextResponse.json(onboarding)
  } catch (error) {
    console.error('[ONBOARDING_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}