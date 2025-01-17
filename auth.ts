import NextAuth, { AuthError } from "next-auth"
import GitHub from "next-auth/providers/github"

export const config = {
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
    async session({ session, token }) {
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
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config)