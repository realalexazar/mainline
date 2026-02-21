'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';

const navItems = [
  { label: 'CATALOG', href: '/products', color: 'bg-lcars-amber' },
  { label: 'CART', href: '/cart', color: 'bg-lcars-blue' },
  { label: 'SHIPPING', href: '/policies/shipping', color: 'bg-lcars-lavender' },
  { label: 'RETURNS', href: '/policies/returns', color: 'bg-lcars-pink' },
  { label: 'PRIVACY', href: '/policies/privacy', color: 'bg-lcars-peach' },
];

export default function LCARSFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-lcars-bg text-lcars-text">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="bg-lcars-amber h-14 w-20 rounded-br-lcars-lg flex items-center justify-center shrink-0"
          >
            <svg className="w-6 h-6 text-lcars-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="bg-lcars-amber h-8 flex-1 rounded-bl-lcars flex items-center justify-end px-6">
            <Link href="/" className="font-mono text-sm text-lcars-bg tracking-widest">
              MAINLINE HUB
            </Link>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="bg-lcars-bg border-b border-lcars-panel p-4 space-y-2 animate-slide-in-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  'block rounded-full px-6 py-2 font-mono text-sm uppercase tracking-widest text-lcars-bg text-center transition-all hover:brightness-110',
                  item.color,
                  pathname === item.href && 'ring-2 ring-lcars-peach'
                )}
              >
                {item.label}
                {item.href === '/cart' && itemCount > 0 && ` (${itemCount})`}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        <div className="w-48 shrink-0 flex flex-col">
          <div className="relative">
            <div className="bg-lcars-amber h-14 w-48 rounded-br-lcars-lg" />
            <Link
              href="/"
              className="absolute inset-0 flex items-center justify-center font-mono text-xs text-lcars-bg tracking-widest"
            >
              MLH
            </Link>
          </div>

          <div className="bg-lcars-orange w-16 flex-1 mt-1 rounded-b-lcars-lg flex flex-col items-center pt-2">
            <div className="w-12 h-6 bg-lcars-tan rounded-full mb-1" />
            <div className="w-12 h-4 bg-lcars-peach rounded-full mb-1" />
            <div className="w-12 h-3 bg-lcars-lavender rounded-full" />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-1">
            <div className="bg-lcars-amber h-8 flex-1 rounded-bl-lcars flex items-center px-6">
              <Link href="/" className="font-mono text-sm text-lcars-bg tracking-widest">
                MAINLINE HUB
              </Link>
              <div className="flex-1" />
              <span className="font-mono text-xs text-lcars-bg/50 tracking-wider">
                LCARS INTERFACE ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 py-3 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-5 py-1.5 font-mono text-xs uppercase tracking-widest text-lcars-bg transition-all hover:brightness-110',
                  item.color,
                  pathname === item.href && 'ring-2 ring-lcars-peach'
                )}
              >
                {item.label}
                {item.href === '/cart' && itemCount > 0 && ` (${itemCount})`}
              </Link>
            ))}
          </div>

          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>

          <div className="flex items-center gap-1 mt-auto">
            <div className="bg-lcars-orange h-6 w-24 rounded-tr-lcars" />
            <div className="bg-lcars-amber h-6 flex-1 rounded-tl-lcars flex items-center justify-end px-6">
              <span className="font-mono text-[10px] text-lcars-bg/50 tracking-wider">
                &copy; {new Date().getFullYear()} MAINLINE HUB — ALL SECTORS
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="lg:hidden p-4 pb-20">
        {children}
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0">
        <div className="flex items-center gap-1">
          <div className="bg-lcars-orange h-5 w-16 rounded-tr-lcars" />
          <div className="bg-lcars-amber h-5 flex-1 rounded-tl-lcars flex items-center justify-end px-4">
            <span className="font-mono text-[9px] text-lcars-bg/50 tracking-wider">
              &copy; {new Date().getFullYear()} MAINLINE HUB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
