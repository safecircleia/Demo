// app/api/family/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateFamilyCode } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()
    const familyCode = generateFamilyCode()

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        familyCode,
        familyRole: 'ADMIN',
        family: {
          connect: { id: session.user.id }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      user: updatedUser 
    })
  } catch (error) {
    console.error('Family creation error:', error)
    return NextResponse.json(
      { error: "Failed to create family" },
      { status: 500 }
    )
  }
}