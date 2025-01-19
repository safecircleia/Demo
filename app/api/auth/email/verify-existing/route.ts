import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { prisma } from "@/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id || !session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { verificationToken } = await req.json()
    
    const verification = await prisma.verificationToken.findFirst({
      where: {
        email: session.user.email,
        token: verificationToken,
        expires: { gt: new Date() }
      }
    })

    if (!verification) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    // Update user as verified with boolean instead of Date
    await prisma.user.update({
      where: { id: session.user.id },
      data: { emailVerified: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
