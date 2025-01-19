import { NextResponse } from 'next/server'
import getServerSession from 'next-auth'
import { authOptions } from 'next-auth'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { step, accountType } = await req.json()

    const onboarding = await prisma.onboardingStatus.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        step,
        accountType,
        completed: step === 2
      },
      create: {
        userId: session.user.id,
        step,
        accountType,
        completed: false
      }
    })

    return NextResponse.json(onboarding)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    )
  }
}