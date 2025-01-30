import { OpenAI } from 'openai'
import { deepseek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'

export type ModelProvider = 'openai' | 'deepseek'
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

  try {
    if (config.provider === 'deepseek') {
      const { text } = await generateText({
        model: deepseek(config.modelName),
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
        maxTokens: config.maxTokens
      })
      
      const result = JSON.parse(text || '{}')
      return processResult(result, startTime)
    } else {
      const openai = createAIClient()
      const response = await openai.chat.completions.create({
        model: config.modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a content safety analyzer. Only respond with valid JSON in the following format: {"status": "SAFE" | "SUSPICIOUS" | "DANGEROUS", "confidence": number, "reason": "string"}'
          },
          {
            role: 'user',
            content: ANALYSIS_PROMPT + message
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      })

      try {
        const result = JSON.parse(response.choices[0].message.content || '{}')
        return processResult(result, startTime)
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return {
          status: 'SUSPICIOUS',
          confidence: 50,
          reason: 'Failed to parse AI response',
          responseTime: performance.now() - startTime
        }
      }
    }
  } catch (error) {
    return {
      status: 'SUSPICIOUS',
      confidence: 50,
      reason: 'Analysis failed: ' + (error as Error).message,
      responseTime: performance.now() - startTime
    }
  }
}

function processResult(result: any, startTime: number): AnalysisResult {
  return {
    status: result.status || 'SUSPICIOUS',
    confidence: Number(result.confidence) || 50,
    reason: result.reason || 'Analysis failed',
    responseTime: performance.now() - startTime,
    rawResponse: JSON.stringify(result)
  }
}