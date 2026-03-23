'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="font-mono text-[0.8rem] text-text-mid uppercase tracking-widest">
          Authenticating...
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-border rounded-[4px] overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="font-mono text-[1rem] uppercase tracking-widest mb-1">Admin</h1>
              <p className="text-[0.8rem] text-text-dim">Sign in to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-[0.7rem] uppercase tracking-wider text-text-dim">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-card border border-border rounded-[4px] px-4 py-2.5 text-[0.9rem] text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
                  placeholder="admin@mainline-hub.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-mono text-[0.7rem] uppercase tracking-wider text-text-dim">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-card border border-border rounded-[4px] px-4 py-2.5 text-[0.9rem] text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="text-[0.8rem] text-sale">{error}</p>
              )}
              <button
                type="submit"
                className="w-full font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg py-3 rounded-[4px] hover:bg-white transition-all"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, token: session.access_token }}>
      <div className="min-h-screen bg-bg text-text">
        <div className="flex items-center border-b border-border px-6 py-3 gap-6">
          <span className="font-mono text-[0.8rem] font-bold tracking-[0.08em] uppercase text-sale">
            Admin
          </span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-[0.75rem] uppercase tracking-wider transition-colors ${
                pathname === item.href ? 'text-text' : 'text-text-dim hover:text-text-mid'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex-1" />
          <Link href="/" className="text-[0.75rem] text-text-dim hover:text-text-mid transition-colors">
            ← Store
          </Link>
          <button
            onClick={handleLogout}
            className="text-[0.75rem] text-text-dim hover:text-text-mid transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </AuthContext.Provider>
  );
}
