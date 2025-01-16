import { NextResponse } from "next/server";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Custom prompt template for analyzing messages
const ANALYSIS_PROMPT = `You are an AI safety system designed to detect potentially harmful or predatory behavior in messages.
Analyze the following message and respond in JSON format with:
1. A risk_level between 0 and 1 (where 1 is highest risk)
2. A brief explanation of your assessment
3. A classification of either "safe", "suspicious", or "malicious"

Message to analyze: "{message}"

Respond only with valid JSON in this format:
{
  "risk_level": number,
  "explanation": string,
  "classification": string
}`;

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface AnalysisResult {
  risk_level: number;
  explanation: string;
  classification: string;
}

async function analyzeWithOllama(message: string): Promise<AnalysisResult> {
  try {
    console.log("Sending request to Ollama...");

    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Add CORS header
      },
      body: JSON.stringify({
        model: "llama2",
        prompt: ANALYSIS_PROMPT.replace("{message}", message),
        stream: false,
      }),
      // Add these options for local development
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: OllamaResponse = await response.json();
    console.log("Ollama response:", data);

    try {
      const analysis: AnalysisResult = JSON.parse(data.response);
      return analysis;
    } catch (parseError) {
      console.error("Failed to parse Ollama response:", parseError);
      return {
        risk_level: 0.5,
        explanation: "Failed to analyze message properly",
        classification: "suspicious",
      };
    }
  } catch (error) {
    console.error("Ollama API error:", error);
    throw new Error(
      `Ollama API error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
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
        risk_level: isHarmful ? 0.8 + Math.random() * 0.2 : Math.random() * 0.3,
        explanation: isHarmful
          ? "Message contains potentially harmful patterns"
          : "Message appears safe",
        classification: isHarmful ? "suspicious" : "safe",
      };
    }

    const response = {
      prediction: analysis.explanation,
      probability: analysis.risk_level,
      classification: analysis.classification,
      details: {
        ...analysis,
      },
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
