import { execSync } from 'child_process'

export function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    const commit = execSync('git rev-parse --short HEAD').toString().trim()
    const version = process.env.NEXT_PUBLIC_APP_VERSION
    
    return {
      branch,
      commit,
      version: version || '0.0.1',
      fullVersion: `${version || '0.0.1'}-${branch}@${commit}`
    }
  } catch (error) {
    console.error('Error getting git info:', error)
    return {
      branch: 'unknown',
      commit: 'unknown',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1',
      fullVersion: `${process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1'}-unknown`
    }
  }
}