import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import CommandPalette from '../components/CommandPalette'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const authCheck = () => {
      const isAuth = localStorage.getItem('sentinel_auth');
      if (!isAuth && router.pathname !== '/login') {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };
    
    // Initial check
    authCheck();

    // Setup listener for subsequent route changes
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router]);

  if (!authorized && router.pathname !== '/login') {
    // Return a completely blank screen matching the dark mode background to prevent flash of content
    return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] transition-colors duration-300"></div>; 
  }

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthGuard>
        <CommandPalette />
        <Component {...pageProps} />
      </AuthGuard>
    </ThemeProvider>
  )
}

export default MyApp
