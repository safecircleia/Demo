import { OpenAI } from 'openai'
import { AIStream } from 'ai'

export type ModelProvider = 'openai' | 'anthropic' | 'google'
export type AnalysisStatus = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS'

export interface AIModelConfig {
  provider: ModelProvider
  modelName: string
  temperature?: number
  maxTokens?: number
}

export interface AnalysisResult {
  status: AnalysisStatus
  confidence: number
  reason: string
  responseTime?: number
  rawResponse?: string
}

export const defaultConfig: AIModelConfig = {
  provider: 'openai',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.1,
  maxTokens: 2048
}

const ANALYSIS_PROMPT = `You are an AI message analyzer evaluating content for potential predatory behavior.
Respond with a JSON object only:
{
  "status": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "confidence": <number 0-100>,
  "reason": "<brief explanation>"
}
Consider: personal information requests, age-related questions, grooming patterns, manipulative language, suspicious meetings, inappropriate content, pressure tactics, isolation attempts.
Analyze: `

export function createAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

export async function analyzeMessage(
  message: string, 
  config: AIModelConfig = defaultConfig
): Promise<AnalysisResult> {
  const startTime = performance.now()
  const openai = createAIClient()

  const response = await openai.chat.completions.create({
    model: config.modelName,
    messages: [
      {
        role: 'system',
        content: 'You are a content safety analyzer. Only respond with valid JSON.'
      },
      {
        role: 'user',
        content: ANALYSIS_PROMPT + message
      }
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  const responseTime = performance.now() - startTime

  return {
    status: result.status || 'SUSPICIOUS',
    confidence: Number(result.confidence) || 50,
    reason: result.reason || 'Analysis failed',
    responseTime,
    rawResponse: JSON.stringify(result)
  }
}