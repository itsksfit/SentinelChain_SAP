import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, Mail, Lock, AlertCircle, User, Building, Calendar, CheckCircle2, ShieldCheck, Sparkles, Activity, Check } from 'lucide-react';
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

  // Helper to read/write mock "database" in cookies
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
    document.cookie = `sentinel_db_users=${encodeURIComponent(JSON.stringify(users))}; path=/; max-age=31536000`;
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
      callbackUrl: '/dashboard'
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
      callbackUrl: '/dashboard'
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white flex antialiased font-sans">
      <Head>
        <title>{`${isLoginView ? 'Sign In' : 'Enterprise Onboarding'} | SentinelChain`}</title>
        <meta name="description" content="Sign in to SentinelChain Enterprise Supply Chain Risk Management & Resilience platform." />
      </Head>

      {/* LEFT PANEL: HERO LUMINOUS GRADIENT (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative hero-luminous-gradient p-12 lg:p-16 flex-col justify-between overflow-hidden">
        
        {/* Subtle Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="SentinelChain" className="h-10 object-contain drop-shadow" />
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur border border-white/20">
            Enterprise SCRM
          </span>
        </div>

        {/* Center Editorial Quote & Floating Command Preview */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-lg">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-orange-200 uppercase tracking-widest block">
              Autonomous Resilience Engine
            </span>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.14] tracking-tight">
              Understand your <span className="font-serif-italic text-white font-normal text-[1.15em]">resilience.</span> Decide faster with AI.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Detect global disruptions in under 45 seconds, correlate affected S/4HANA bill of materials, match pin-compatible spot inventory from Mouser, and dispatch automated purchase requisitions.
            </p>
          </div>

          {/* Floating Command Preview Card */}
          <div className="floating-card-shadow rounded-2xl p-5 bg-[#0C0D10]/85 border border-white/15 backdrop-blur-md text-white space-y-3">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold">USGS 6.8M Seismic Alert — Hsinchu Fab Cluster</span>
              </div>
              <span className="font-mono text-[10px] text-orange-300">TELEMETRY_LIVE</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Impacted MPN:</span>
              <span className="font-mono font-bold text-white">STM32F401RE (ARM Cortex-M4)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Mouser Spot Allocation:</span>
              <span className="font-bold text-emerald-400">3,384 Units Qualified • 3-Day Courier</span>
            </div>
          </div>
        </div>

        {/* Footer Trust Indicators */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70 border-t border-white/15 pt-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-white" /> ISO 27001 Certified</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-white" /> SOC 2 Type II Compliant</span>
          </div>
          <span>SAP S/4HANA Certified API</span>
        </div>
      </div>

      {/* RIGHT PANEL: CLEAN ENTERPRISE AUTH FORM */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Mobile Brand Link */}
          <div className="lg:hidden flex items-center mb-4">
            <img src="/logo-dark.png" alt="SentinelChain" className="h-8 object-contain block dark:hidden" />
            <img src="/logo.png" alt="SentinelChain" className="h-8 object-contain hidden dark:block" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
              {isLoginView ? 'Welcome back' : 'Create Enterprise Account'}
            </h2>
            <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1.5">
              {isLoginView 
                ? 'Sign in to access your supply chain command center and live threat feeds.' 
                : 'Join SentinelChain to protect physical plants and automate procurement.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-[#F1F2F4] dark:bg-[#16171B] rounded-xl border border-[#E5E7EB] dark:border-[#262626]">
            <button
              onClick={() => { setIsLoginView(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                isLoginView 
                  ? 'bg-white dark:bg-[#202127] text-secondary-900 dark:text-white shadow-2xs' 
                  : 'text-secondary-500 hover:text-secondary-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginView(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                !isLoginView 
                  ? 'bg-white dark:bg-[#202127] text-secondary-900 dark:text-white shadow-2xs' 
                  : 'text-secondary-500 hover:text-secondary-900 dark:hover:text-white'
              }`}
            >
              Onboarding
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Enterprise SSO / OAuth Options */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSSO('google')}
              className="w-full py-2.5 px-4 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#1A1B20] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold text-secondary-800 dark:text-secondary-200 flex items-center justify-center gap-3 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => handleSSO('github')}
              className="w-full py-2.5 px-4 bg-white dark:bg-[#141414] hover:bg-secondary-50 dark:hover:bg-[#1A1B20] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs font-bold text-secondary-800 dark:text-secondary-200 flex items-center justify-center gap-3 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub Enterprise</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5E7EB] dark:border-[#262626] w-full"></div>
            <span className="bg-[#F9FAFB] dark:bg-[#090A0C] px-3 text-[11px] font-bold uppercase tracking-wider text-secondary-400">
              Or email credentials
            </span>
          </div>

          {/* SIGN IN VIEW */}
          {isLoginView ? (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-secondary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="procurement@semicorp.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    Password
                  </label>
                  <span className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary !h-11 w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Command Center'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ONBOARDING VIEW */
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Company / Plant</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Infineon / TSMC"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="alex@enterprise.com"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="32"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white dark:bg-[#141414] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-xs text-secondary-900 dark:text-white outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary !h-11 w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
              >
                Complete Onboarding & Launch <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 text-center">
            <Link href="/" className="text-xs font-bold text-secondary-500 hover:text-primary-500 transition-colors">
              ← Return to SentinelChain Public Overview
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
