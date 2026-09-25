import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'content-type': 'application/json' };

function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

/**
 * D10 kill switch — read process.env INSIDE the handler on every request,
 * never at module top level, so toggling the env at runtime takes effect
 * without a rebuild. Only the exact string "false" closes the guestbook.
 */
function isGuestbookClosed(): boolean {
  return process.env.GUESTBOOK_ENABLED === 'false';
}

/**
 * Best-effort rate limit per D9 — in-memory, per instance (resets on restart
 * and is not shared across replicas). Enough to blunt drive-by spam; not a
 * hard guarantee.
 */
const RATE_LIMIT_MAX_POSTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const postHits = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return 'unknown';
}

function isRateLimited(request: Request): boolean {
  const key = clientKey(request);
  const now = Date.now();
  const hits = (postHits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  postHits.set(key, hits);
  if (hits.length >= RATE_LIMIT_MAX_POSTS) return true;
  hits.push(now);
  return false;
}

export const GET: APIRoute = async () => {
  if (isGuestbookClosed()) {
    // D10: closed guestbook still answers 200 with an empty list.
    return jsonResponse(200, { entries: [] });
  }
  try {
    return jsonResponse(200, { entries: listGuestbook() });
  } catch {
    // D11: never pass err.message through to the response.
    return jsonResponse(500, { error: 'INTERNAL_ERROR' });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (isGuestbookClosed()) return jsonResponse(503, { error: 'GUESTBOOK_CLOSED' });
  if (isRateLimited(request)) return jsonResponse(429, { error: 'RATE_LIMITED' });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'INVALID_INPUT' });
  }
  if (body === null || typeof body !== 'object') {
    return jsonResponse(400, { error: 'INVALID_INPUT' });
  }
  const { name, message, website } = body as Record<string, unknown>;

  // Honeypot (D9): humans leave "website" empty. Bots that fill it are
  // dropped silently with 201 (no insert) — the UI only checks res.ok.
  if (typeof website === 'string' && website.trim() !== '') {
    return jsonResponse(201, { ok: true });
  }
  if (typeof name !== 'string' || typeof message !== 'string') {
    return jsonResponse(400, { error: 'INVALID_INPUT' });
  }

  try {
    const row = insertGuestbook({ name, message });
    return jsonResponse(201, row);
  } catch (err) {
    const code = err instanceof Error ? err.message : '';
    if (code === 'VALIDATION_ERROR') return jsonResponse(400, { error: 'INVALID_INPUT' });
    return jsonResponse(500, { error: 'INTERNAL_ERROR' });
  }
};
