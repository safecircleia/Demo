import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    accountType: string
    emailVerified: Date | null
    githubUsername?: string
  }

  interface Session {
    user: User & {
      id: string
      accountType: string
      emailVerified: Date | null
      githubUsername?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accountType: string
    emailVerified: boolean
    accessToken?: string
  }
}