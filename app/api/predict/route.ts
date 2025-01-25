import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get Ollama configuration from environment variables with fallbacks
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost';
const OLLAMA_PORT = process.env.OLLAMA_PORT || '11434';
const OLLAMA_API_URL = `${OLLAMA_HOST}:${OLLAMA_PORT}/api/generate`;

// Custom prompt template for analyzing messages
const ANALYSIS_PROMPT = `You are an AI message analyzer evaluating content for potential predatory behavior.
IMPORTANT: Respond ONLY with a JSON object matching this exact format, nothing else:

{
  "status": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "confidence": <number 0-100>,
  "reason": "<brief explanation>"
}

Analyze this message: {message}

Consider:
- Personal information requests
- Age-related questions
- Grooming patterns
- Manipulative language
- Suspicious meeting requests
- Inappropriate content
- Pressure tactics
- Isolation attempts

Remember: ONLY output the JSON object, no other text.`;

// Add model mapping for consistent naming
type ModelVersion = 'deepseek' | 'llama';
type AnalysisStatus = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';

interface ModelSettings {
  modelVersion?: ModelVersion;
  temperature?: number;
  maxTokens?: number;
}

const MODEL_MAPPING: Record<ModelVersion, string> = {
  deepseek: 'deepseek-r1:7b',
  llama: 'llama3.2'
} as const;

const DEFAULT_MODEL: ModelVersion = 'llama';

interface OllamaResponse {
  response: string;
}

interface AnalysisResult {
  status: AnalysisStatus;
  confidence: number;
  reason: string;
  responseTime?: number;
  rawResponse?: string;
}

function validateStatus(status: string): AnalysisStatus {
  if (!['SAFE', 'SUSPICIOUS', 'DANGEROUS'].includes(status)) {
    return 'SUSPICIOUS'; // Default fallback
  }
  return status as AnalysisStatus;
}

function normalizeAnalysisResult(rawResult: any, responseTime: number): AnalysisResult {
  return {
    status: validateStatus(rawResult.status),
    confidence: Number(rawResult.confidence) || 0.5,
    reason: String(rawResult.reason) || 'No reason provided',
    responseTime,
    rawResponse: JSON.stringify(rawResult)
  };
}

async function analyzeWithOllama(message: string, settings?: ModelSettings): Promise<AnalysisResult> {
  const startTime = performance.now();
  
  try {
    const modelVersion = settings?.modelVersion || DEFAULT_MODEL;
    const modelName = MODEL_MAPPING[modelVersion] || MODEL_MAPPING[DEFAULT_MODEL];
    console.log("Using model:", modelName);

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt: ANALYSIS_PROMPT.replace("{message}", message),
        stream: false,
        options: {
          temperature: settings?.temperature || 0.1,
          top_p: 0.9,
          max_tokens: settings?.maxTokens || 2048,
          repeat_penalty: 1.1
        }
      }),
      cache: "no-store",
    }).catch(error => {
      console.error("Fetch error:", error);
      throw new Error(`Failed to connect to Ollama: ${error.message}`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      console.error("Ollama API error details:", errorText);
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const responseTime = performance.now() - startTime;
    
    return normalizeAnalysisResult(result, responseTime);
  } catch (error) {
    console.error("Analysis error details:", error);
    throw error;
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

interface DbUserSettings {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  modelVersion: string;
  temperature: number;
  maxTokens: number;
  safetyLevel: string;
  streaming: boolean;
  timeout: number;
}

function convertDbSettingsToModelSettings(dbSettings: DbUserSettings | null | undefined): ModelSettings | undefined {
  if (!dbSettings) return undefined;
  
  return {
    modelVersion: dbSettings.modelVersion as ModelVersion,
    temperature: dbSettings.temperature,
    maxTokens: dbSettings.maxTokens
  };
}

class OllamaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaError';
  }
}

function isOllamaError(error: unknown): error is OllamaError {
  return error instanceof OllamaError ||
    (error instanceof Error && error.message.includes('Ollama'));
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

    // Fetch user's AI settings
    let userSettings = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { aiSettings: true },
      });
      userSettings = user?.aiSettings;
    }

    console.log("Using settings:", userSettings);

    let analysis: AnalysisResult;
    try {
      const modelSettings = convertDbSettingsToModelSettings(userSettings);
      analysis = await analyzeWithOllama(message, modelSettings);
    } catch (error: unknown) {
      console.error("Detailed Ollama error:", error);
      
      if (isOllamaError(error) && error.message.includes('Failed to connect')) {
        console.warn("Ollama service unavailable, using fallback analysis");
        // Handle fallback logic here
        const harmfulPatterns = [
          /privado/i,
          /foto/i,
          /secreto/i,
          /solo/i,
          /edad/i,
          /conocerte/i,
          /ropa/i,
          /padres/i,
          /maduro/i,
          /cine/i,
          /vives/i,
          /novio|novia/i,
          /amigos especiales/i,
          /habitación/i,
        ];

        const isHarmful = harmfulPatterns.some((pattern) =>
          pattern.test(message),
        );
        analysis = {
          status: isHarmful ? 'SUSPICIOUS' : 'SAFE',
          confidence: isHarmful ? 80 + Math.random() * 20 : Math.random() * 30,
          reason: isHarmful
            ? "Message contains potentially harmful patterns"
            : "Message appears safe",
        };
      } else {
        return NextResponse.json(
          { error: "Analysis failed" },
          { status: 500 }
        );
      }
    }

    const response = {
      prediction: analysis.reason,
      probability: analysis.confidence,
      classification: analysis.status,
      details: {
        explanation: analysis.reason,
        risk_level: analysis.confidence,
        classification: analysis.status
      },
      responseTime: analysis.responseTime,
      rawResponse: analysis.rawResponse, // Ensure rawResponse is included
      modelUsed: userSettings?.modelVersion || "llama3.2",
      settings: {
        temperature: userSettings?.temperature || 0.1,
        maxTokens: userSettings?.maxTokens || 2048
      }
    };

    console.log("Sending response:", response);

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: unknown) {
    console.error("Detailed error processing message:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.name : "UnknownError"
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }
}