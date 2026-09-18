import Head from 'next/head';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ title, description, children, maxWidth = '1100px' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const metaTitle = title
    ? `${title} — SentinelChain`
    : 'SentinelChain — Supply Chain Command Center';
  const metaDesc =
    description || 'Autonomous AI-powered supply chain resilience and procurement platform.';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Sidebar — handles its own mobile state via prop */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Page shell */}
      <div
        className="flex flex-col min-h-screen"
        style={{ paddingLeft: 'var(--sidebar-w)', transition: 'none' }}
      >
        {/* Override padding on small screens */}
        <style jsx>{`
          @media (max-width: 1023px) {
            div { padding-left: 0 !important; }
          }
        `}</style>

        <Navbar onMenuClick={() => setMobileOpen(o => !o)} />

        <main
          className="flex-1 px-6 py-6 pb-16 w-full mx-auto"
          style={{ maxWidth }}
        >
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
