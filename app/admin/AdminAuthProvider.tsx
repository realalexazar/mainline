'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import LCARSInput from '@/components/lcars/LCARSInput';
import LCARSButton from '@/components/lcars/LCARSButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const AuthContext = createContext<{ session: Session | null; token: string }>({
  session: null,
  token: '',
});

export function useAdminAuth() {
  return useContext(AuthContext);
}

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
];

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const sb = getSupabaseBrowser();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const sb = getSupabaseBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  const handleLogout = async () => {
    const sb = getSupabaseBrowser();
    await sb.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lcars-bg flex items-center justify-center">
        <span className="font-mono text-sm text-lcars-amber animate-lcars-pulse uppercase tracking-widest">
          Authenticating...
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-lcars-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="border border-lcars-amber rounded-tl-lcars rounded-br-lcars overflow-hidden">
            <div className="h-2 bg-lcars-red" />
            <div className="p-8 space-y-6">
              <div className="text-center">
                <h1 className="font-mono text-xl text-lcars-amber uppercase tracking-widest">
                  Admin Access
                </h1>
                <p className="font-mono text-xs text-lcars-orange/60 mt-1 uppercase">
                  Authorization Required
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <LCARSInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mainlinehub.com"
                  required
                />
                <LCARSInput
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {error && (
                  <p className="font-mono text-xs text-lcars-red uppercase">{error}</p>
                )}
                <LCARSButton type="submit" color="amber" fullWidth>
                  Authenticate
                </LCARSButton>
              </form>
            </div>
            <div className="h-2 bg-lcars-orange" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, token: session.access_token }}>
      <div className="min-h-screen bg-lcars-bg text-lcars-text">
        {/* Admin top bar */}
        <div className="flex items-center gap-1">
          <div className="bg-lcars-red h-10 w-32 rounded-br-lcars flex items-center justify-center">
            <span className="font-mono text-xs text-white uppercase tracking-widest">Admin</span>
          </div>
          <div className="bg-lcars-orange h-7 flex-1 rounded-bl-lcars flex items-center px-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-mono text-xs uppercase tracking-wider',
                  pathname === item.href ? 'text-lcars-bg' : 'text-lcars-bg/60 hover:text-lcars-bg'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex-1" />
            <Link href="/" className="font-mono text-xs text-white/60 uppercase hover:text-white">
              Store →
            </Link>
            <button
              onClick={handleLogout}
              className="font-mono text-xs text-lcars-bg/60 uppercase hover:text-lcars-bg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Admin content */}
        <div className="p-6">{children}</div>
      </div>
    </AuthContext.Provider>
  );
}
