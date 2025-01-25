// app/api/family/members/route.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/prisma"
import { Resend } from 'resend'
import FamilyInvitationEmail from '@/emails/FamilyInvitation'
import { defaultFamilySettings, FamilySettings } from "@/types/family"

const resend = new Resend(process.env.RESEND_API_KEY)

// Get family members
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    // Validate session and user email
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user with family data
    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      },
      include: {
        family: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.family) {
      return NextResponse.json({
        members: [],
        invitations: [],
        settings: defaultFamilySettings
      })
    }

    // Get family members
    const familyMembers = await prisma.user.findMany({
      where: { 
        familyId: user.family.id 
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        accountType: true,
        familyRole: true
      }
    })

    // Get pending invitations
    const invitations = await prisma.familyInvitation.findMany({
      where: {
        familyId: user.family.id,
        status: "PENDING"
      },
      select: {
        id: true,
        email: true,
        status: true,
        invited: {
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

    // Parse settings with fallback
    let settings: FamilySettings;
    try {
      settings = typeof user.family.settings === 'string' 
        ? JSON.parse(user.family.settings)
        : user.family.settings;
    } catch {
      settings = defaultFamilySettings;
    }

    return NextResponse.json({
      members: familyMembers,
      invitations: invitations,
      family: user.family ? {
        id: user.family.id,
        name: user.family.name,
        code: user.family.code,
        icon: user.family.icon
      } : null,
      settings: settings
    })

  } catch (error) {
    console.error('Members fetch error:', error)
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

    // Get the current user first
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true }
    })

    if (!currentUser || !currentUser.family) {
      return NextResponse.json(
        { error: "Current user or family not found" },
        { status: 404 }
      )
    }

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

    // Update with the correct family ID from currentUser
    await prisma.user.update({
      where: { email },
      data: {
        familyId: currentUser.family.id,
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
    console.error('Family invitation error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}