import Head from 'next/head';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ title, description, children, maxWidth = '1600px' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const metaTitle = title
    ? `${title} — SentinelChain`
    : 'SentinelChain — Autonomous Supply Chain Risk Management & Resilience';
  const metaDesc =
    description || 'Autonomous AI-powered supply chain resilience, ERP exposure mapping, and spot procurement platform.';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090A0C] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Page shell */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(o => !o)} />

        <main
          className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-8 pb-28 w-full mx-auto min-w-0"
          style={{ maxWidth }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
