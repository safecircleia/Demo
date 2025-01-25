import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get invitationId from URL
    const invitationId = request.url.split('/').pop()
    if (!invitationId) {
      return new NextResponse('Invitation ID is required', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { familyRole: true }
    })

    if (user?.familyRole !== 'ADMIN') {
      return new NextResponse('Not authorized', { status: 403 })
    }

    await prisma.familyInvitation.delete({
      where: { id: invitationId }
    })

    return NextResponse.json({
      success: true,
      message: 'Invitation removed successfully'
    })
  } catch (error) {
    console.error('Invitation removal error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}