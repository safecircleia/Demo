// app/api/family/members/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Resend } from 'resend'
import FamilyInvitationEmail from '@/emails/FamilyInvitation'

const resend = new Resend(process.env.RESEND_API_KEY)

// Get family members
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        familyMembers: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            accountType: true
          }
        }
      }
    })

    return NextResponse.json(user?.familyMembers || [])
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch family members" },
      { status: 500 }
    )
  }
}

// Invite new member
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    // Check if inviting user exists and has a family
    const invitedUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User does not have an account yet" }, 
        { status: 404 }
      )
    }

    if (invitedUser.familyId) {
      return NextResponse.json(
        { error: "User is already part of a family" },
        { status: 400 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      )
    }

    // Add user to family
    await prisma.user.update({
      where: { email },
      data: {
        familyId: currentUser.id,
        familyCode: currentUser.familyCode
      }
    })

    // Send email notification
    await resend.emails.send({
      from: 'Family Circle <noreply@safecircle.tomasps.com>',
      to: email,
      subject: `${currentUser.name} added you to their Family Circle`,
      react: FamilyInvitationEmail({
        inviterName: currentUser.name || 'A family member',
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Family invitation error:', error)
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}