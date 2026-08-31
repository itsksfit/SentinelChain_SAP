import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "placeholder",
      clientSecret: process.env.GOOGLE_SECRET || "placeholder",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)
