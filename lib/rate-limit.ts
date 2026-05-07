import { NextRequest } from 'next/server';

// Tiny in-memory rate limiter. Good enough for v1 on a single Vercel
// serverless instance per region; if you scale to high traffic or want
// global limits, swap to Upstash Redis with the same interface.
//
// Usage:
//   const limit = checkRateLimit(req, { windowMs: 60_000, max: 30 });
//   if (!limit.ok) return new NextResponse('Too many requests', { status: 429 });

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

const MAX_BUCKETS = 10_000;

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  // Optional: scope key prefix so different routes don't share buckets.
  scope?: string;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function getClientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for; fall back to a constant so dev still works.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

export function checkRateLimit(
  req: NextRequest,
  opts: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(req);
  const key = `${opts.scope || 'default'}:${ip}`;
  const now = Date.now();

  // Periodic cap on bucket count to avoid memory growth from random IPs.
  if (buckets.size > MAX_BUCKETS) {
    buckets.forEach((v, k) => {
      if (v.resetAt < now) buckets.delete(k);
    });
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.max - 1, retryAfterMs: 0 };
  }

  entry.count += 1;
  if (entry.count > opts.max) {
    return { ok: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  return { ok: true, remaining: opts.max - entry.count, retryAfterMs: 0 };
}
