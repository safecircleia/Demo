import NextAuth, { AuthError } from "next-auth"
import GitHub from "next-auth/providers/github"
import { type DefaultSession, type NextAuthConfig } from "next-auth"
import { JWT } from "next-auth/jwt"

// Extend the Session interface
interface ExtendedSession extends DefaultSession {
  user: {
    id: string
  } & DefaultSession["user"]
}

const config = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  callbacks: {
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config)