import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { analyzeMessage, AIModelConfig } from "@/lib/ai-config"

const DAILY_LIMIT = 10

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { aiSettings: true }
    });

    // Fix the fetch URL to use absolute path
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = req.headers.get('host') || 'localhost:3000'

    // Check token limit first with error handling
    try {
      const limitsResponse = await fetch(`${protocol}://${host}/api/limits`, {
        headers: {
          Cookie: req.headers.get('cookie') || '',  // Forward the auth cookie
        },
        credentials: 'include',
      })
      
      if (!limitsResponse.ok) {
        throw new Error(`Limits check failed: ${limitsResponse.statusText}`)
      }
      
      const limits = await limitsResponse.json()
      console.log('Limits response:', limits) // Add logging for debugging

      // Check if response has the expected structure
      if (!limits || typeof limits.tokens?.remaining !== 'number') {
        console.error('Invalid limits response structure:', limits)
        throw new Error('Invalid limits response structure')
      }

      if (limits.tokens.remaining <= 0) {
        return NextResponse.json(
          { error: "Token limit reached. Please try again tomorrow." },
          { status: 429 }
        )
      }

      // Increment token usage only if we have tokens remaining
      await fetch(`${protocol}://${host}/api/limits`, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Cookie: req.headers.get('cookie') || '',  // Forward the auth cookie
        },
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error checking limits:', error)
      // Continue with the request even if limits check fails
    }

    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      )
    }

    // Get user settings and configure model
    let modelConfig: AIModelConfig | undefined
    if (session?.user?.email) {
      if (user?.aiSettings) {
        const modelVersion = user.aiSettings.modelVersion || 'gpt3'
        modelConfig = {
          provider: modelVersion === 'deepseek' ? 'deepseek' : 'openai',
          modelName: modelVersion === 'gpt4' ? 'gpt-4' : 
                    modelVersion === 'deepseek' ? 'deepseek-chat' : 
                    'gpt-3.5-turbo',
          temperature: user.aiSettings.temperature,
          maxTokens: user.aiSettings.maxTokens
        }
      }
    }

    const analysis = await analyzeMessage(message, modelConfig)
    
    // Convert responseTime to integer if it exists
    const responseTime = analysis.responseTime ? Math.round(analysis.responseTime) : undefined

    // Create log entry if user is authenticated
    if (session?.user?.email) {
      if (user) {
        await prisma.messageLog.create({
          data: {
            message,
            userId: user.id,
            status: analysis.status,
            confidence: analysis.confidence,
            reason: analysis.reason,
            responseTime,
            modelUsed: modelConfig?.modelName || 'gpt-3.5-turbo'
          }
        })
      }
    }

    return NextResponse.json({
      prediction: analysis.reason,
      probability: analysis.confidence,
      classification: analysis.status,
      details: {
        explanation: analysis.reason,
        risk_level: analysis.confidence,
        classification: analysis.status
      },
      responseTime,
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