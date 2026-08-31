import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For hackathon demo purposes, we accept any email and password 
        // so the judges can easily test it, and inject it into the real NextAuth session.
        if (credentials?.email && credentials?.password) {
          return {
            id: "demo-user-1",
            name: credentials.email.split('@')[0],
            email: credentials.email,
            image: "https://ui-avatars.com/api/?name=" + encodeURIComponent(credentials.email) + "&background=random"
          }
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)
