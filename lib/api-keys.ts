import { createHash, randomBytes } from 'crypto'

export function generateApiKey(): { key: string; hashedKey: string; prefix: string } {
  const key = 'sk_' + randomBytes(24).toString('hex');
  const prefix = key.slice(0, 8);
  const hashedKey = createHash('sha256').update(key).digest('hex');
  
  return { key, hashedKey, prefix };
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}