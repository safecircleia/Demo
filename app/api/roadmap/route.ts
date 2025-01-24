import { NextResponse } from 'next/server'
import { octokit } from '@/lib/github'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = 10

    const response = await octokit.rest.issues.listForRepo({
      owner: 'tresillo2017',
      repo: 'safecircle',
      state: 'all',
      per_page,
      page,
    });
    
    const items = response.data.map(issue => {
      const inProgressLabels = [
        'in progress',
        'in-progress',
        'wip',
        'working',
        'started',
        'development',
        'implementing',
        '🚧'
      ];
      
      const isInProgress = issue.labels.some(label => 
        inProgressLabels.some(progress => {
          if (typeof label === 'string') {
            return label.toLowerCase().includes(progress.toLowerCase());
          }
          return label.name?.toLowerCase().includes(progress.toLowerCase());
        })
      );

      return {
        id: issue.number,
        title: issue.title,
        state: issue.state === "closed" ? "completed" : 
               isInProgress ? "in-progress" : "planned",
        description: issue.body || "",
        labels: issue.labels.map(l => 
          typeof l === 'string' ? l : (l.name || '')
        ),
        html_url: issue.html_url,
        created_at: issue.created_at
      };
    });

    return NextResponse.json({
      items,
      hasMore: items.length === per_page,
      nextPage: page + 1
    });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}