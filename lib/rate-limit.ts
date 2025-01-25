import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export async function getRateLimit(key: string, limit: number, window: string) {
  const count = await redis.incr(key)
  
  if (count === 1) {
    await redis.expire(key, parseInt(window))
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count)
  }
}