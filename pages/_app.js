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

  // If unauthenticated, show the dashboard blurred out in the background
  // and pop up a modal asking them to sign up!
  if (status === "unauthenticated" && router.pathname !== '/login') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Blurred background app */}
        <div className="pointer-events-none blur-[8px] select-none opacity-40 transition-all duration-1000 h-screen overflow-hidden">
          {children}
        </div>
        
        {/* Signup Popup Modal */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f1115]/95 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-white/10 text-center relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
            
            <img src="/shield.png" className="w-20 h-20 mx-auto mb-6 drop-shadow-xl relative z-10" alt="Logo" />
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 relative z-10">
              Welcome to SentinelChain
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm md:text-base leading-relaxed relative z-10">
              Connect your enterprise ERP and instantly detect global supply chain disruptions using AI.
            </p>
            
            <button 
              onClick={() => router.push('/login')}
              className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] relative z-10"
            >
              Get Started / Sign In
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            
            <p className="mt-6 text-xs text-gray-400 font-medium uppercase tracking-widest relative z-10">
              Enterprise Grade Security
            </p>
          </div>
        </div>
      </div>
    );
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
