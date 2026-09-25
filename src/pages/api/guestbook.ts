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
 *
 * Key choice (L11): behind a reverse proxy (Coolify/Traefik) the LAST entry
 * of x-forwarded-for is the one the trusted proxy appended — earlier entries
 * are client-controlled and spoofable. Direct node access has no XFF, so we
 * fall back to Astro's clientAddress (socket peer). If neither exists we do
 * NOT fall back to one shared bucket — that would lock the whole site behind
 * a single limit — and skip limiting instead (best-effort trade-off).
 */
const RATE_LIMIT_MAX_POSTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const postHits = new Map<string, number[]>();

function clientKey(request: Request, clientAddress: string | undefined): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map((h) => h.trim()).filter(Boolean);
    const proxyAppended = hops[hops.length - 1];
    if (proxyAppended) return proxyAppended;
  }
  if (clientAddress) return clientAddress;
  return null;
}

function isRateLimited(request: Request, clientAddress: string | undefined): boolean {
  const key = clientKey(request, clientAddress);
  if (!key) return false;
  const now = Date.now();
  // Sweep expired keys on every recorded request so the map cannot grow
  // unbounded when clients (or spoofed headers) never repeat.
  for (const [k, times] of postHits) {
    const alive = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (alive.length === 0) postHits.delete(k);
    else postHits.set(k, alive);
  }
  const hits = postHits.get(key) ?? [];
  if (hits.length >= RATE_LIMIT_MAX_POSTS) return true;
  hits.push(now);
  postHits.set(key, hits);
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (isGuestbookClosed()) return jsonResponse(503, { error: 'GUESTBOOK_CLOSED' });
  if (isRateLimited(request, clientAddress)) return jsonResponse(429, { error: 'RATE_LIMITED' });

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

  // Honeypot (D9 · L11): humans leave "website" empty. Any value that is not
  // an absent field or a blank string — including non-string values such as
  // `"website": 1` — is a bot: dropped silently with 201 (no insert). The UI
  // only checks res.ok.
  if (website !== undefined) {
    const blankString = typeof website === 'string' && website.trim() === '';
    if (!blankString) return jsonResponse(201, { ok: true });
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
