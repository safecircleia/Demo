import { NextResponse } from 'next/server'

export async function GET() {
  // Use Vercel's environment variables
  const version = '0.6.2'
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'unknown'
  
  return NextResponse.json({
    version,
    branch,
    commit: commit.substring(0, 7) // Show only first 7 characters of commit hash
  })
}