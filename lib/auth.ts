import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase/server';

export type AdminAuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; response: NextResponse };

// Centralised admin gate used by every /api/admin/* route.
//
// Steps:
//  1. Pull the bearer token off the Authorization header.
//  2. Resolve the user via Supabase (the service-role key lets us call
//     auth.getUser with any access token).
//  3. Look up the user's row in the `profiles` table and require
//     `role = 'admin'`. This is the actual RBAC check: simply being
//     authenticated is NOT enough.
//
// Returns { ok: true, ... } on success, or a ready-to-return 401/403
// response on failure so callers can do:
//   const auth = await requireAdmin(req);
//   if (!auth.ok) return auth.response;
export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Missing bearer token' }, { status: 401 }),
    };
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Empty bearer token' }, { status: 401 }),
    };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid session' }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Profile lookup failed' }, { status: 500 }),
    };
  }

  if (!profile || profile.role !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    userId: userData.user.id,
    email: userData.user.email ?? null,
  };
}
