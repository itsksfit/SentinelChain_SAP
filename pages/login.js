import { signIn } from 'next-auth/react';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import Head from 'next/head';

export default function Login() {
  const handleSSO = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <Head>
        <title>Login | SentinelChain</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/shield.png" alt="Logo" className="w-16 h-16 object-contain drop-shadow-md" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          SentinelChain
        </h2>
        <p className="mt-2 text-center text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Global Integrity Ecosystem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#0f1115]/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/10">
          
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              onClick={() => handleSSO('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm bg-white dark:bg-black/20 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button 
              type="button"
              onClick={() => alert("Please configure Azure AD credentials in .env.local to enable Microsoft SSO.")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm bg-white dark:bg-black/20 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
              Continue with Microsoft
            </button>

            <button 
              type="button"
              onClick={() => alert("Please configure SAP BTP IAS credentials in .env.local to enable SAP SSO.")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm bg-white dark:bg-black/20 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <img className="w-10 h-5 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" alt="SAP" />
              Continue with SAP ID
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#0f1115] text-gray-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Email/Password auth requires a database adapter. Please use Google SSO above."); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Enterprise Email
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  placeholder="admin@enterprise.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Secure Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
