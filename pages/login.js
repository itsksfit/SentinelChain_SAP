import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, Mail, Lock, AlertCircle, User, Building, Calendar, CheckCircle2 } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

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
  };
  
  const setDbUsers = (users) => {
    document.cookie = `sentinel_db_users=${encodeURIComponent(JSON.stringify(users))}; path=/; max-age=31536000`; // 1 year expiry
  };

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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <Head>
        <title>{isLoginView ? 'Sign In' : 'Enterprise Onboarding'} | SentinelChain</title>
        <meta name="description" content="Sign in or register for SentinelChain Enterprise Supply Chain Risk Management." />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex flex-col items-center group">
          <div className="relative mb-2">
            <img src="/shield.png" alt="SentinelChain Shield" className="w-14 h-14 object-contain drop-shadow-sm transition-transform group-hover:scale-105" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-500 ring-2 ring-white dark:ring-[#080808]"></span>
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
            SentinelChain
          </h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Enterprise SCRM Platform
          </p>
        </Link>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full ${isLoginView ? 'sm:max-w-md' : 'sm:max-w-xl'} px-4`}>
        <div className="bg-white dark:bg-[#111111] py-8 px-6 sm:px-10 shadow-card dark:shadow-dark-card rounded-2xl border border-[#E8E8E8] dark:border-[#222222]">
          
          {isLoginView && (
            <div className="space-y-3 mb-6">
              <button 
                type="button"
                onClick={() => handleSSO('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E8E8E8] dark:border-[#262626] rounded-lg shadow-2xs bg-white dark:bg-[#161616] text-xs font-bold text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Enterprise Google SSO
              </button>
              
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E8E8] dark:border-[#222222]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-[#111111] text-secondary-400 font-medium">
                    Or sign in with email
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-base font-bold text-secondary-900 dark:text-white">
              {isLoginView ? 'Sign in to Command Center' : 'Create an enterprise account'}
            </h3>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg p-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-lg p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{success}</p>
            </div>
          )}

          {isLoginView ? (
            // LOGIN FORM
            <form className="space-y-4" onSubmit={handleManualLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-secondary-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs font-medium outline-none focus:border-primary-500"
                    placeholder="admin@enterprise.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs font-medium outline-none focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary !h-10 text-xs font-bold uppercase tracking-wider shadow-sm mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Secure Sign In <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
          ) : (
            // SIGNUP FORM
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Full Name</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Age</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="number" min="1" required value={age} onChange={(e) => setAge(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="21"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Company</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="Acme Electronics"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Enterprise Email</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="jane@acme.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Set Password</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="password" required minLength="6" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 dark:text-secondary-300 mb-1.5">Confirm Password</label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-secondary-400" />
                    </div>
                    <input
                      type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-[#F8F9FA] dark:bg-[#161616] border border-[#E8E8E8] dark:border-[#262626] rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 text-xs outline-none focus:border-primary-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary !h-10 text-xs font-bold uppercase tracking-wider shadow-sm mt-3"
              >
                Create Enterprise Account
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError('');
                setSuccess('');
              }}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              {isLoginView ? "Don't have an enterprise account? Sign up" : "Already registered? Sign in"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
