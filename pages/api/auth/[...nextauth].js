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
        const { email, password } = credentials;

        if (!email || !password) throw new Error("Please enter both email and password.");

        // 1. Basic format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error("Invalid email format.");

        // 2. Reject fake/test domains
        const fakeDomains = ['test.com', 'example.com', 'fake.com', 'mailinator.com', 'demo.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (fakeDomains.includes(domain)) {
          throw new Error("Please use a real enterprise email domain.");
        }

        // 3. Strict Password Validation
        // This allows the user to test the "wrong password" UI during the pitch.
        if (password !== 'Admin123!') {
          throw new Error("Invalid password. Please try again.");
        }

        // If it passes, create the session
        return {
          id: "demo-user-1",
          name: email.split('@')[0],
          email: email,
          image: "https://ui-avatars.com/api/?name=" + encodeURIComponent(email) + "&background=random"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev",
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)
