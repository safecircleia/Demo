import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { defaultFamilySettings } from "@/types/family"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    // Parse settings and combine with family data
    const familySettings = typeof user.family.settings === 'string'
      ? JSON.parse(user.family.settings)
      : user.family.settings;

    return NextResponse.json({ 
      success: true, 
      settings: {
        familyName: user.family.name,
        familyIcon: user.family.icon,
        ...familySettings
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { settings } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    // Update family settings
    const updatedFamily = await prisma.family.update({
      where: { id: user.family.id },
      data: {
        name: settings.familyName,
        icon: settings.familyIcon,
        settings: JSON.stringify({
          notifications: settings.notifications,
          security: settings.security
        })
      }
    })

    return NextResponse.json({
      success: true,
      settings: {
        familyName: updatedFamily.name,
        familyIcon: updatedFamily.icon,
        ...JSON.parse(updatedFamily.settings as string)
      }
    })

  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}