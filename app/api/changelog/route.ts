import { NextResponse } from 'next/server'
import { octokit } from '@/lib/github'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = 10

    const response = await octokit.rest.repos.listCommits({
      owner: 'tresillo2017',
      repo: 'safecircle',
      per_page,
      page,
    })

    const commits = response.data.map(commit => ({
      sha: commit.sha,
      html_url: commit.html_url,
      commit: commit.commit,
      verification: commit.commit.verification
    }))

    return NextResponse.json({
      commits,
      hasMore: commits.length === per_page,
      nextPage: page + 1
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch commits' }, { status: 500 })
  }
}