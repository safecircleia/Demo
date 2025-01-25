import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request
) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get memberId from URL
    const memberId = request.url.split('/').pop()
    if (!memberId) {
      return new NextResponse('Member ID is required', { status: 400 })
    }

    // Remove family association
    const updatedUser = await prisma.user.update({
      where: { id: memberId },
      data: {
        familyId: null,
        familyCode: null,
        familyRole: 'MEMBER'
      }
    })

    if (!updatedUser) {
      return new NextResponse('Member not found', { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully'
    })

  } catch (error) {
    console.error('Family member removal error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}