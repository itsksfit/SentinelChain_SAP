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
      async authorize(credentials, req) {
        const { email, password } = credentials;

        if (!email || !password) throw new Error("Please enter both email and password.");

        // Safely parse the cookie from headers
        let usersCookie = null;
        if (req && req.headers && req.headers.cookie) {
          const match = req.headers.cookie.match(/(?:^| )sentinel_db_users=([^;]+)/);
          if (match) {
            usersCookie = match[1];
          }
        }
        
        let users = [];
        if (usersCookie) {
          try {
            users = JSON.parse(decodeURIComponent(usersCookie));
          } catch (e) {
            console.error("Failed to parse mock DB", e);
          }
        }

        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error("No account found with this email. Please sign up first.");
        }

        if (user.password !== password) {
          throw new Error("Invalid password. Please try again.");
        }

        return {
          id: email,
          name: user.name || email.split('@')[0],
          email: user.email,
          image: "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || email) + "&background=random"
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
