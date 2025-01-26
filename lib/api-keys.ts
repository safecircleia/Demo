import { createHash, randomBytes } from 'crypto'

interface ApiKeyData {
  key: string
  hashedKey: string
  prefix: string
}

export async function generateApiKey(): Promise<ApiKeyData> {
  // Generate random bytes
  const array = new Uint8Array(24)
  crypto.getRandomValues(array)
  
  // Convert to hex string
  const key = 'sk_' + Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  const prefix = key.slice(0, 8)
  const hashedKey = await hashApiKey(key)
  
  return { key, hashedKey, prefix }
}

export async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}