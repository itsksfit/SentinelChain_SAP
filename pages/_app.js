import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import CommandPalette from '../components/CommandPalette'
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router'

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] transition-colors duration-300"></div>;
  }

  if (status === "unauthenticated" && router.pathname !== '/login') {
    router.push('/login');
    return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] transition-colors duration-300"></div>;
  }

  return children;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthGuard>
          <CommandPalette />
          <Component {...pageProps} />
        </AuthGuard>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
