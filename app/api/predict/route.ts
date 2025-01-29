import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { analyzeMessage, AIModelConfig } from "@/lib/ai-config"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      )
    }

    // Get user settings
    let modelConfig: AIModelConfig | undefined
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { aiSettings: true }
      })

      if (user?.aiSettings) {
        modelConfig = {
          provider: 'openai',
          modelName: user.aiSettings.modelVersion === 'deepseek' 
            ? 'gpt-4'
            : 'gpt-3.5-turbo',
          temperature: user.aiSettings.temperature,
          maxTokens: user.aiSettings.maxTokens
        }
      }
    }

    const analysis = await analyzeMessage(message, modelConfig)

    return NextResponse.json({
      prediction: analysis.reason,
      probability: analysis.confidence,
      classification: analysis.status,
      details: {
        explanation: analysis.reason,
        risk_level: analysis.confidence,
        classification: analysis.status
      },
      responseTime: analysis.responseTime,
      rawResponse: analysis.rawResponse,
      modelUsed: modelConfig?.modelName || 'gpt-3.5-turbo'
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    })

  } catch (error: unknown) {
    console.error("Error processing message:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}