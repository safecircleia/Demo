import NextAuth, { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    accountType: string
    onboardingComplete: boolean
    familyCode: string | null
  }

  interface Session {
    user: User
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