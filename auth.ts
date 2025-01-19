import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Extend the Session interface
interface ExtendedSession extends DefaultSession {
  user: {
    id: string
  } & DefaultSession["user"]
}

export const config = {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser: '/auth/onboarding'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accountType = user.accountType
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.accountType = token.accountType
      }
      return session
    },
    async signIn({ user }) {
      if (!user) return false

      const onboarding = await prisma.onboardingStatus.findUnique({
        where: { userId: user.id }
      })
      
      if (!onboarding) {
        return '/auth/onboarding'
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config)