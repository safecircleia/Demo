import { NextResponse } from 'next/server'
import { apiAuthMiddleware } from '@/middleware/api-auth'

export async function GET(request: Request) {
  // Verify API key
  const middlewareResponse = await apiAuthMiddleware(request)
  if (middlewareResponse.status !== 200) {
    return middlewareResponse
  }

  // Your API logic here
  return NextResponse.json({ message: "Success" })
}