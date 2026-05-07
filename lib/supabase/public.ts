import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client that uses the *anon* key. Use this for any
// public read (storefront product listings, PDPs, etc). RLS still
// applies, so it's safe to call from server components.
//
// For privileged work (writing orders, reading customer rows, fulfilling
// Printify orders), use `supabaseAdmin` from `./server.ts` instead.

let _supabasePublic: SupabaseClient | null = null;

export const supabasePublic: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabasePublic) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        throw new Error(
          'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        );
      }

      _supabasePublic = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    }

    const value = (_supabasePublic as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(_supabasePublic);
    }
    return value;
  },
});
