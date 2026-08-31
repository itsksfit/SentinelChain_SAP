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

        // For this hackathon, we are simulating a database using a secure cookie
        // This allows real persistent registration without needing Postgres/Prisma!
        const usersCookie = req.cookies.sentinel_db_users;
        let users = [];
        
        if (usersCookie) {
          try {
            users = JSON.parse(decodeURIComponent(usersCookie));
          } catch (e) {
            console.error("Failed to parse mock DB", e);
          }
        }

        // Search our "database" for the user
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error("No account found with this email. Please sign up first.");
        }

        // Validate password
        if (user.password !== password) {
          throw new Error("Invalid password. Please try again.");
        }

        // Success! Create the session
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
