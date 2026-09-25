import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * POST /api/contact — closed per D8: no form in v1, the only channels are the
 * alias email (mailto) and the GitHub profile. The route answers 410 so bots
 * cannot keep posting into a form nobody reads.
 *
 * insertContact in src/lib/db.ts stays implemented (validation + insert) so
 * tests/labs/lab05-api.test.ts passes; it is ready if a form ever opens
 * (which per DECISIONS requires a data-collection notice first).
 */
export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'GONE' }), {
    status: 410,
    headers: { 'content-type': 'application/json' },
  });
};
