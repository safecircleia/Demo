import { NextResponse } from "next/server";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Custom prompt template for analyzing messages
const ANALYSIS_PROMPT = `As an AI safety analyzer, evaluate the following message for potential predatory or harmful content. Support both English and Spanish analysis.

Context: You are evaluating messages to detect potential online predators and harmful content.

Analyze this message: {message}

Provide your analysis in the following strict JSON format:
{
  "status": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "confidence": <number between 0-100>,
  "reason": "<brief explanation focusing on behavioral patterns and risk factors>"
}

Analysis criteria:
1. Personal information requests
2. Age-related questions
3. Grooming patterns
4. Manipulative language
5. Suspicious meeting requests
6. Inappropriate content
7. Pressure tactics
8. Isolation attempts

Do not include translations. Focus on intent analysis.`;

interface OllamaResponse {
  response: string;
}

interface AnalysisResult {
  status: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  confidence: number;
  reason: string;
  responseTime?: number;
  rawResponse?: string;
}

async function analyzeWithOllama(message: string): Promise<AnalysisResult> {
  const startTime = performance.now();
  
  try {
    console.log("Analyzing message:", message);

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: ANALYSIS_PROMPT.replace("{message}", message),
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          max_tokens: 2048,
          repeat_penalty: 1.1
        }
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    const responseTime = Math.round(performance.now() - startTime);
    
    try {
      const analysisResult = JSON.parse(data.response);
      
      return {
        status: analysisResult.status,
        confidence: analysisResult.confidence,
        reason: analysisResult.reason,
        responseTime: responseTime,
        rawResponse: data.response
      };
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError);
      throw new Error("Invalid analysis format received");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
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

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

    console.log("Analyzing message:", message);

    // Add a fallback mechanism for development/testing
    let analysis: AnalysisResult;
    try {
      analysis = await analyzeWithOllama(message);
    } catch (ollamaError) {
      console.error("Ollama analysis failed, using fallback:", ollamaError);
      // Fallback to pattern matching if Ollama fails
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
      rawResponse: analysis.rawResponse
    };

    console.log("Sending response:", response);

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
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