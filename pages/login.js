import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, Mail, Lock, AlertCircle, User, Building, Calendar, CheckCircle2 } from 'lucide-react';
import Head from 'next/head';

export default function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [company, setCompany] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Helper to read/write our mock "database" in cookies for the hackathon demo
  const getDbUsers = () => {
    if (typeof document === 'undefined') return [];
    const match = document.cookie.match(new RegExp('(^| )sentinel_db_users=([^;]+)'));
    if (match) {
      try { return JSON.parse(decodeURIComponent(match[2])); } 
      catch (e) { return []; }
    }
    return [];
  }
  
  const setDbUsers = (users) => {
    document.cookie = `sentinel_db_users=${encodeURIComponent(JSON.stringify(users))}; path=/; max-age=31536000`; // 1 year expiry
  }

  const handleSSO = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (parseInt(age) < 18) {
      setError("You must be 18 or older to create an enterprise account.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = getDbUsers();
    if (users.find(u => u.email === signupEmail)) {
      setError("An account with this email is already registered.");
      return;
    }

    // Create user in our cookie DB
    users.push({
      name,
      age,
      company,
      email: signupEmail,
      password: signupPassword
    });
    setDbUsers(users);
    
    // Auto-login instantly after signup
    setSuccess("Account created successfully! Logging you in...");
    
    const res = await signIn('credentials', {
      redirect: false,
      email: signupEmail,
      password: signupPassword,
      callbackUrl: '/'
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const res = await signIn('credentials', {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
      callbackUrl: '/'
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0f18] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <Head>
        <title>{isLoginView ? 'Login' : 'Sign Up'} | SentinelChain</title>
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

      <div className={`mt-8 sm:mx-auto sm:w-full ${isLoginView ? 'sm:max-w-md' : 'sm:max-w-xl'}`}>
        <div className="bg-white dark:bg-[#0f1115]/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/10">
          
          {isLoginView && (
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
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#0f1115] text-gray-500 font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isLoginView ? 'Sign in to your account' : 'Create an enterprise account'}
            </h3>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-3 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{success}</p>
            </div>
          )}

          {isLoginView ? (
            // ================= LOGIN FORM =================
            <form className="space-y-6" onSubmit={handleManualLogin}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="admin@enterprise.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Secure Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            // ================= SIGNUP FORM =================
            <form className="space-y-5" onSubmit={handleSignup}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Age</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number" min="1" required value={age} onChange={(e) => setAge(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Enterprise Email</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="jane@acme.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Set Password</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="password" required minLength="6" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 transition-all"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError('');
                setSuccess('');
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
