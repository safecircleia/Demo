import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { credentialId } = await request.json()

    if (!credentialId) {
      return new NextResponse('Credential ID is required', { status: 400 })
    }

    // Delete the authenticator
    await prisma.authenticator.delete({
      where: {
        credentialID: credentialId,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to remove passkey:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}