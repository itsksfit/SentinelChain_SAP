import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Mail, Lock, AlertCircle, X } from 'lucide-react';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);

  // SSO Modals State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showMsftModal, setShowMsftModal] = useState(false);
  const [showSapModal, setShowSapModal] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('sentinel_saved_email');
    if (savedEmail) {
      setIsNewUser(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      const savedEmail = localStorage.getItem('sentinel_saved_email');
      const savedPassword = localStorage.getItem('sentinel_saved_password');

      if (!savedEmail) {
        localStorage.setItem('sentinel_saved_email', email);
        localStorage.setItem('sentinel_saved_password', password);
        localStorage.setItem('sentinel_auth', 'true');
        localStorage.setItem('sentinel_user', email);
        router.push('/');
      } else {
        if (email !== savedEmail || password !== savedPassword) {
          setError('Invalid email or password. Please try again.');
          setIsLoading(false);
        } else {
          localStorage.setItem('sentinel_auth', 'true');
          localStorage.setItem('sentinel_user', email);
          router.push('/');
        }
      }
    }, 1200);
  };

  const handleSSOSelect = (selectedEmail, providerModalSetter) => {
    providerModalSetter(false);
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('sentinel_auth', 'true');
      localStorage.setItem('sentinel_user', selectedEmail);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <Head>
        <title>Login | SentinelChain</title>
      </Head>

      {/* GOOGLE SSO MODAL (MOCK) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl p-10 transform transition-all text-center">
            <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h2 className="text-2xl font-normal text-[#202124] mb-2">Sign in</h2>
            <p className="text-[16px] text-[#202124] mb-8 font-medium">Choose an account<br/><span className="font-normal text-sm text-[#5f6368]">to continue to SentinelChain</span></p>
            
            <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mb-8">
              <button onClick={() => handleSSOSelect('krishnasharma@gmail.com', setShowGoogleModal)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-200 transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-lg">K</div>
                <div>
                  <p className="text-sm font-medium text-[#3c4043]">Krishna Sharma</p>
                  <p className="text-[13px] text-[#5f6368]">krishnasharma@gmail.com</p>
                </div>
              </button>
              
              <button onClick={() => handleSSOSelect('admin@enterprise.com', setShowGoogleModal)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium text-lg">E</div>
                <div>
                  <p className="text-sm font-medium text-[#3c4043]">Enterprise Admin</p>
                  <p className="text-[13px] text-[#5f6368]">admin@enterprise.com</p>
                </div>
              </button>
            </div>

            <button onClick={() => setShowGoogleModal(false)} className="px-6 py-2 rounded text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SAP SSO MODAL (MOCK) */}
      {showSapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-[400px] rounded shadow-2xl p-8 transform transition-all text-center border-t-4 border-blue-600">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" className="w-16 h-8 object-contain mx-auto mb-6" alt="SAP" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">SAP Universal ID</h2>
            <p className="text-sm text-gray-600 mb-6">Select your identity provider to continue to SentinelChain S/4HANA integrations.</p>
            
            <div className="space-y-3 mb-6">
              <button onClick={() => handleSSOSelect('global.admin@sap.com', setShowSapModal)} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded text-sm font-bold transition-colors">
                Login as Enterprise Admin
              </button>
              <button onClick={() => setShowSapModal(false)} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-3 rounded text-sm font-bold transition-colors">
                Cancel Authentication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MICROSOFT SSO MODAL (MOCK) */}
      {showMsftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-[400px] shadow-2xl p-10 transform transition-all">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-24 h-6 object-contain mb-6" alt="Microsoft" />
            <h2 className="text-2xl font-semibold text-[#1b1b1b] mb-2">Pick an account</h2>
            
            <div className="w-full mt-6 mb-8">
              <button onClick={() => handleSSOSelect('krishna@microsoft.com', setShowMsftModal)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors text-left">
                <img src="/shield.png" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-[15px] font-semibold text-[#1b1b1b]">Krishna Sharma</p>
                  <p className="text-[13px] text-[#666666]">krishna@microsoft.com</p>
                  <p className="text-[12px] text-[#666666] mt-0.5">Connected to Windows</p>
                </div>
              </button>
            </div>
            
            <div className="flex justify-end">
              <button onClick={() => setShowMsftModal(false)} className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-black text-[15px] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


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
              onClick={() => setShowGoogleModal(true)}
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
              onClick={() => setShowMsftModal(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm bg-white dark:bg-black/20 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
              Continue with Microsoft
            </button>

            <button 
              type="button"
              onClick={() => setShowSapModal(true)}
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

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

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
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="admin@enterprise.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password {isNewUser && <span className="text-xs text-indigo-500 font-normal ml-1">(Create a new password)</span>}
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {isNewUser ? 'Create Account & Sign In' : 'Secure Sign In'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
