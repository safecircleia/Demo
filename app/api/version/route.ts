import { getGitInfo } from '@/lib/utils/git-info'
import { NextResponse } from 'next/server'

export async function GET() {
  const gitInfo = getGitInfo()
  
  return NextResponse.json({
    version: gitInfo.version,
    branch: gitInfo.branch,
    commit: gitInfo.commit
  })
}