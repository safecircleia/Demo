import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const DAILY_MESSAGE_LIMIT = 10
const DAILY_TOKEN_LIMIT = 10

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { aiSettings: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create AISettings if it doesn't exist
    const aiSettings = user.aiSettings || await prisma.aISettings.create({
      data: {
        userId: user.id,
      }
    })

    // Get today's message count
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const messageCount = await prisma.messageLog.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today
        }
      }
    })

    // Calculate next reset time (midnight tonight)
    const resetTime = new Date(today)
    resetTime.setDate(resetTime.getDate() + 1)

    // Check if we need to reset tokens (if last reset was before today)
    const lastReset = aiSettings.tokensResetAt || new Date(0)
    if (lastReset < today) {
      await prisma.aISettings.update({
        where: { userId: user.id },
        data: {
          tokensUsed: 0,
          tokensResetAt: today
        }
      })
    }

    const tokensUsed = aiSettings.tokensUsed || 0

    return NextResponse.json({
      messages: {
        used: messageCount,
        limit: DAILY_MESSAGE_LIMIT,
        remaining: Math.max(0, DAILY_MESSAGE_LIMIT - messageCount),
      },
      tokens: {
        used: tokensUsed,
        limit: DAILY_TOKEN_LIMIT,
        remaining: Math.max(0, DAILY_TOKEN_LIMIT - tokensUsed),
      },
      resetsAt: resetTime.toISOString()
    })
  } catch (error) {
    console.error("Error checking limits:", error)
    return NextResponse.json({ error: "Failed to check limits" }, { status: 500 })
  }
}

// Add token usage endpoint
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Increment token usage
    const updated = await prisma.aISettings.update({
      where: { userId: user.id },
      data: {
        tokensUsed: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      tokensRemaining: Math.max(0, DAILY_TOKEN_LIMIT - updated.tokensUsed)
    })
  } catch (error) {
    console.error("Error updating token usage:", error)
    return NextResponse.json({ error: "Failed to update token usage" }, { status: 500 })
  }
}
