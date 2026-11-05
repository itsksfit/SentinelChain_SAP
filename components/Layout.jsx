import Head from 'next/head';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ title, description, children, maxWidth = '1440px' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const metaTitle = title
    ? `${title} — SentinelChain`
    : 'SentinelChain — Autonomous Supply Chain Risk Management & Resilience';
  const metaDesc =
    description || 'Autonomous AI-powered supply chain resilience, ERP exposure mapping, and spot procurement platform.';

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080808] text-secondary-900 dark:text-white transition-colors duration-200">
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
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 w-full mx-auto min-w-0"
          style={{ maxWidth }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
