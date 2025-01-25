import NextAuth from "next-auth"
import type { DefaultSession } from 'next-auth'

export type FamilyRole = 'ADMIN' | 'MEMBER'

declare module "next-auth" {
  interface ExtendedUser {
    familyRole?: FamilyRole
    onboardingComplete?: boolean
  }

  interface User extends ExtendedUser {}

  interface Session {
    user: ExtendedUser & DefaultSession["user"]
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

export {}