/**
 * Newsletter signup handler, shared by:
 *   - app/api/subscribe/route.ts        → POST /api/subscribe
 *   - netlify/functions/subscribe.mts   → POST /.netlify/functions/subscribe (legacy)
 *
 * Saves a signup as a Shopify customer with email marketing consent =
 * SUBSCRIBED, tagged "newsletter-popup". Existing customers are updated, not
 * duplicated.
 * Body: { email: string, source?: string, website?: string, turnstileToken?: string }
 *
 * ── Server environment variables ──
 *   SHOPIFY_ADMIN_DOMAIN     your-store.myshopify.com  (falls back to NEXT_PUBLIC_SHOPIFY_DOMAIN)
 *   SHOPIFY_ADMIN_TOKEN      permanent Admin API token (Partner Dashboard app), OR
 *   SHOPIFY_CLIENT_ID +
 *   SHOPIFY_CLIENT_SECRET    Dev Dashboard app (client-credentials grant)
 *
 *   ALLOWED_ORIGINS          optional, comma-separated extra origins allowed to POST
 *                            (artisunskin.com and www.artisunskin.com are always allowed)
 *   TURNSTILE_SECRET_KEY     optional. When set, every signup must carry a valid
 *                            Cloudflare Turnstile token (set NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *                            too so the forms render the widget).
 *   SUBSCRIBE_STATUS_KEY     optional. GET /api/subscribe?key=<value> shows the setup
 *                            check. Without it (or with the wrong key) GET returns 404.
 *
 * App scopes needed: read_customers, write_customers
 *
 * SECURITY NOTES
 *   - Phone / SMS signup was removed. No form on the site collected a phone,
 *     so the only way to reach it was a script — which could opt any number
 *     into SMS marketing, or attach an attacker's number to someone else's
 *     customer record.
 *   - A customer who has UNSUBSCRIBED is never silently re-subscribed by this
 *     endpoint (anyone can type anyone's email). The response is identical
 *     either way, so it can't be used to test which emails are customers.
 *   - Per-IP, per-email and global rate limits live in process memory. That
 *     is effective on a long-running Node server (Hostinger Node.js hosting,
 *     `next start`). On serverless hosts each instance has its own counters;
 *     turn on Turnstile there.
 */

import { timingSafeEqual } from 'node:crypto';

const API_VERSION = '2026-01';
const TAG = 'newsletter-popup';
const MAX_BODY_BYTES = 2_048;

function shopDomain(): string {
  const raw = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '';
  return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

// ── Access token (client credentials grant, cached while the process is warm) ──
let cachedToken: string | null = null;
let cachedUntil = 0;

async function getToken(): Promise<string> {
  const legacy = process.env.SHOPIFY_ADMIN_TOKEN;
  if (legacy) return legacy;

  if (cachedToken && Date.now() < cachedUntil - 60_000) return cachedToken;

  const id = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Missing SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET');

  const res = await fetch(`https://${shopDomain()}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = json.access_token;
  cachedUntil = Date.now() + json.expires_in * 1000;
  return cachedToken;
}

async function admin<T = any>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${shopDomain()}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': await getToken() },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Admin API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`Admin API errors: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

// ── Validation ──
// Deliberately strict: letters, digits and the usual punctuation only. No
// quotes, backslashes, spaces, colons or parentheses, so nothing in an email
// can change the meaning of the Shopify customer search query below.
const EMAIL_RE = /^[a-z0-9._%+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

function consent() {
  return {
    marketingState: 'SUBSCRIBED',
    marketingOptInLevel: 'SINGLE_OPT_IN',
    consentUpdatedAt: new Date().toISOString(),
  };
}

type UserError = { field?: string[] | null; message: string };

// ── Rate limiting (in-memory, fixed window) ──
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** True if this key is still under `limit` hits in the current `windowMs`. */
function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    // Keep the map from growing without bound under a flood of unique keys.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
      if (buckets.size > 10_000) buckets.clear();
    }
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-real-ip') ||
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

// ── Origin check ──
const DEFAULT_ORIGINS = ['https://artisunskin.com', 'https://www.artisunskin.com'];

function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin');
  // Browsers always send Origin on a POST fetch. A missing Origin means a
  // non-browser client; those are refused.
  if (!origin) return false;

  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  if ([...DEFAULT_ORIGINS, ...extra].includes(origin)) return true;

  // Same-origin requests on preview/staging domains: Origin host equals the
  // host the proxy says the request was sent to.
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim();
  try {
    return host !== '' && new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ── Cloudflare Turnstile (optional) ──
async function turnstileOk(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not enabled
  if (typeof token !== 'string' || !token || token.length > 4096) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, ...(ip !== 'unknown' ? { remoteip: ip } : {}) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('subscribe: turnstile verify failed', err);
    return false;
  }
}

// ── Shopify operations ──
type FoundCustomer = { id: string; email: string | null; emailMarketingConsent: { marketingState: string } | null };

async function findCustomer(email: string): Promise<FoundCustomer | null> {
  const data = await admin<{ customers: { nodes: FoundCustomer[] } }>(
    `query($q: String!) {
      customers(first: 5, query: $q) { nodes { id email emailMarketingConsent { marketingState } } }
    }`,
    // EMAIL_RE already rules out quotes and backslashes; escaping anyway is free.
    { q: `email:"${email.replace(/[\\"]/g, '\\$&')}"` },
  );
  // Shopify search is fuzzy. Only act on an exact, case-insensitive match.
  return data.customers.nodes.find((n) => (n.email ?? '').toLowerCase() === email) ?? null;
}

async function createCustomer(email: string) {
  const res = await admin<{ customerCreate: { customer: { id: string } | null; userErrors: UserError[] } }>(
    `mutation($input: CustomerInput!) {
      customerCreate(input: $input) { customer { id } userErrors { field message } }
    }`,
    { input: { email, tags: [TAG], emailMarketingConsent: consent() } },
  );
  const errs = res.customerCreate.userErrors;
  // Two signups racing for the same email: the other one already created it.
  if (errs.length && errs.some((e) => /taken|already/i.test(e.message))) return;
  if (errs.length) throw new Error(`customerCreate: ${JSON.stringify(errs)}`);
}

async function updateCustomer(c: FoundCustomer) {
  const state = c.emailMarketingConsent?.marketingState;
  // Someone who unsubscribed stays unsubscribed. Anyone can type anyone's
  // email into this form, so it can't be treated as that person re-opting in.
  if (state === 'UNSUBSCRIBED') return;

  if (state !== 'SUBSCRIBED') {
    await admin(
      `mutation($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) { userErrors { field message } }
      }`,
      { input: { customerId: c.id, emailMarketingConsent: consent() } },
    );
  }

  await admin(
    `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
    { id: c.id, tags: [TAG] },
  );
}

// ── Handler ──
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });

const TOO_MANY = () =>
  json({ ok: false, error: 'Too many attempts. Please try again in a few minutes.' }, 429, { 'Retry-After': '600' });

export async function handleSubscribe(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });

  if (!originAllowed(req)) return json({ ok: false, error: 'Forbidden' }, 403);

  // JSON only: a cross-site HTML form can't send application/json without a
  // CORS preflight, which this endpoint never approves.
  if (!(req.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: 'Invalid request' }, 415);
  }

  const ip = clientIp(req);
  // Per IP: 5 signups / 10 min. Whole site: 60 / min (protects the Shopify
  // Admin API rate limit even if the per-IP limit is dodged).
  if (!allow(`ip:${ip}`, 5, 10 * 60_000) || !allow('global', 60, 60_000)) return TOO_MANY();

  let body: { email?: unknown; website?: unknown; turnstileToken?: unknown };
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: 'Invalid request' }, 413);
    body = JSON.parse(text);
    if (!body || typeof body !== 'object') throw new Error('not an object');
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  // Honeypot: real people never fill the hidden "website" field.
  if (body.website) return json({ ok: true });

  const email = String(body.email ?? '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email.' }, 400);
  }

  // Same email: 3 / hour, so one address can't be used to hammer Shopify.
  if (!allow(`email:${email}`, 3, 60 * 60_000)) return TOO_MANY();

  if (!(await turnstileOk(body.turnstileToken, ip))) {
    return json({ ok: false, error: 'Please complete the verification and try again.' }, 403);
  }

  if (!shopDomain()) {
    console.error('subscribe: SHOPIFY_ADMIN_DOMAIN is not set');
    return json({ ok: false, error: 'Signup is not available right now.' }, 500);
  }

  try {
    const existing = await findCustomer(email);
    if (existing) await updateCustomer(existing);
    else await createCustomer(email);
    return json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  }
}

function keyMatches(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * GET /api/subscribe?key=<SUBSCRIBE_STATUS_KEY> — setup check.
 * Returns 404 unless SUBSCRIBE_STATUS_KEY is set and the key matches, so the
 * public can't see the store domain, which variables exist, or burn Admin API
 * calls by refreshing it. Never returns secret values.
 */
export async function subscribeStatus(req: Request): Promise<Response> {
  const expected = process.env.SUBSCRIBE_STATUS_KEY;
  if (!expected || !keyMatches(new URL(req.url).searchParams.get('key'), expected)) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  if (!allow('status', 10, 60_000)) return TOO_MANY();

  const env = {
    SHOPIFY_ADMIN_DOMAIN: Boolean(process.env.SHOPIFY_ADMIN_DOMAIN),
    NEXT_PUBLIC_SHOPIFY_DOMAIN: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN),
    SHOPIFY_ADMIN_TOKEN: Boolean(process.env.SHOPIFY_ADMIN_TOKEN),
    SHOPIFY_CLIENT_ID: Boolean(process.env.SHOPIFY_CLIENT_ID),
    SHOPIFY_CLIENT_SECRET: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
    TURNSTILE_SECRET_KEY: Boolean(process.env.TURNSTILE_SECRET_KEY),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
    SHOPIFY_AUTH_SETUP_is_on: process.env.SHOPIFY_AUTH_SETUP === 'on',
  };
  const domain = shopDomain();
  let shopify: string;
  let fix: string | null = null;

  if (!domain) {
    shopify = 'no store domain';
    fix = 'Add SHOPIFY_ADMIN_DOMAIN (e.g. your-store.myshopify.com) to the hosting environment variables, then redeploy.';
  } else if (!env.SHOPIFY_ADMIN_TOKEN && !(env.SHOPIFY_CLIENT_ID && env.SHOPIFY_CLIENT_SECRET)) {
    shopify = 'no admin credentials';
    fix = 'Add SHOPIFY_ADMIN_TOKEN (or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET), then redeploy.';
  } else {
    try {
      const d = await admin<{ shop: { name: string } }>(`{ shop { name } }`);
      shopify = `connected to "${d.shop.name}"`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      shopify = 'credentials rejected';
      if (/shop_not_permitted/i.test(msg)) {
        fix = 'This is a Partner app, so it needs SHOPIFY_ADMIN_TOKEN. Get one once via /api/shopify-auth (set SHOPIFY_AUTH_SETUP=on first).';
      } else if (/401|403|Invalid API key|access token/i.test(msg)) {
        fix = 'Token/credentials are wrong or the app lacks read_customers + write_customers scopes.';
      } else if (/404/.test(msg)) {
        fix = 'Store domain is wrong. Use the *.myshopify.com domain, not checkout.artisunskin.com.';
      } else {
        fix = 'Unexpected Shopify error — see the server log.';
        console.error('subscribe status:', msg);
      }
    }
  }
  if (!fix && env.SHOPIFY_AUTH_SETUP_is_on) {
    fix = 'Everything works, but SHOPIFY_AUTH_SETUP is still "on". Remove it so /api/shopify-auth is switched off.';
  }

  return new Response(JSON.stringify({ ok: !fix, domain: domain || null, env, shopify, fix }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
