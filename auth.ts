import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any, // Temporary type assertion
  providers: [Google, Passkey],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/onboarding'
  },
  experimental: {
    enableWebAuthn: true
  }
})