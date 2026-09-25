/**
 * Newsletter signup handler, shared by:
 *   - app/api/subscribe/route.ts        → POST /api/subscribe   (Vercel + Netlify)
 *   - netlify/functions/subscribe.mts   → POST /.netlify/functions/subscribe (legacy)
 *
 * Saves a signup as a Shopify customer with email (and SMS, if a phone is
 * given) marketing consent = SUBSCRIBED, tagged "newsletter-popup".
 * Existing customers are updated, not duplicated.
 * Body: { email: string, phone?: string, source?: string, website?: string }
 *
 * ── Server environment variables (Vercel: Project → Settings → Environment Variables) ──
 *   SHOPIFY_ADMIN_DOMAIN     your-store.myshopify.com  (falls back to NEXT_PUBLIC_SHOPIFY_DOMAIN)
 *   SHOPIFY_ADMIN_TOKEN      permanent Admin API token (Partner Dashboard app), OR
 *   SHOPIFY_CLIENT_ID +
 *   SHOPIFY_CLIENT_SECRET    Dev Dashboard app (client-credentials grant)
 *
 * App scopes needed: read_customers, write_customers
 * This runs on the server only, so Admin credentials never reach the browser.
 */

const API_VERSION = '2026-01';
const TAG = 'newsletter-popup';

function shopDomain(): string {
  const raw = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '';
  return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

// ── Access token (client credentials grant, cached while the function is warm) ──
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
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: id,
      client_secret: secret,
    }),
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
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getToken(),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Admin API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`Admin API errors: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

// ── Validation ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Normalise to E.164. Bare 10-digit numbers are treated as Indian (+91). */
function normalisePhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, '');
  let e164: string;
  if (trimmed.startsWith('+')) e164 = `+${digits}`;
  else if (digits.length === 10) e164 = `+91${digits}`;
  else if (digits.length === 12 && digits.startsWith('91')) e164 = `+${digits}`;
  else if (digits.length === 11 && digits.startsWith('0')) e164 = `+91${digits.slice(1)}`;
  else return null;
  return /^\+[1-9]\d{7,14}$/.test(e164) ? e164 : null;
}

function consent() {
  return {
    marketingState: 'SUBSCRIBED',
    marketingOptInLevel: 'SINGLE_OPT_IN',
    consentUpdatedAt: new Date().toISOString(),
  };
}

type UserError = { field?: string[] | null; message: string };
const phoneTaken = (errs: UserError[]) =>
  errs.some((e) => (e.field ?? []).includes('phone') || /phone/i.test(e.message));

// ── Shopify operations ──
async function findCustomer(email: string) {
  const data = await admin<{ customers: { nodes: { id: string; phone: string | null }[] } }>(
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id phone } } }`,
    { q: `email:"${email.replace(/"/g, '')}"` },
  );
  return data.customers.nodes[0] ?? null;
}

async function createCustomer(email: string, phone: string | null) {
  const run = (withPhone: boolean) =>
    admin<{ customerCreate: { customer: { id: string } | null; userErrors: UserError[] } }>(
      `mutation($input: CustomerInput!) {
        customerCreate(input: $input) { customer { id } userErrors { field message } }
      }`,
      {
        input: {
          email,
          tags: [TAG],
          emailMarketingConsent: consent(),
          ...(withPhone && phone ? { phone, smsMarketingConsent: consent() } : {}),
        },
      },
    );

  let res = await run(true);
  // Phone already belongs to another customer → still save the email signup.
  if (res.customerCreate.userErrors.length && phone && phoneTaken(res.customerCreate.userErrors)) {
    res = await run(false);
  }
  if (res.customerCreate.userErrors.length) {
    throw new Error(`customerCreate: ${JSON.stringify(res.customerCreate.userErrors)}`);
  }
}

async function updateCustomer(id: string, existingPhone: string | null, phone: string | null) {
  await admin(
    `mutation($input: CustomerEmailMarketingConsentUpdateInput!) {
      customerEmailMarketingConsentUpdate(input: $input) { userErrors { field message } }
    }`,
    { input: { customerId: id, emailMarketingConsent: consent() } },
  );

  await admin(
    `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
    { id, tags: [TAG] },
  );

  let hasPhone = Boolean(existingPhone);
  if (phone && !existingPhone) {
    const r = await admin<{ customerUpdate: { userErrors: UserError[] } }>(
      `mutation($input: CustomerInput!) {
        customerUpdate(input: $input) { userErrors { field message } }
      }`,
      { input: { id, phone } },
    );
    hasPhone = r.customerUpdate.userErrors.length === 0;
  }

  // Only opt in to SMS when this signup actually gave a phone number.
  if (phone && hasPhone) {
    await admin(
      `mutation($input: CustomerSmsMarketingConsentUpdateInput!) {
        customerSmsMarketingConsentUpdate(input: $input) { userErrors { field message } }
      }`,
      { input: { customerId: id, smsMarketingConsent: consent() } },
    );
  }
}

// ── Handler ──
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function handleSubscribe(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body: { email?: string; phone?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  // Honeypot: real people never fill the hidden "website" field.
  if (body.website) return json({ ok: true });

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Please enter a valid email.' }, 400);
  }

  const rawPhone = String(body.phone ?? '');
  const phone = rawPhone.trim() ? normalisePhone(rawPhone) : null;
  if (rawPhone.trim() && !phone) {
    return json({ ok: false, error: 'Please enter a valid phone number.' }, 400);
  }

  if (!shopDomain()) {
    console.error('subscribe: SHOPIFY_ADMIN_DOMAIN is not set');
    return json({ ok: false, error: 'Signup is not available right now.' }, 500);
  }

  try {
    const existing = await findCustomer(email);
    if (existing) await updateCustomer(existing.id, existing.phone, phone);
    else await createCustomer(email, phone);
    return json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 502);
  }
}

/**
 * GET /api/subscribe — setup check, safe to open in a browser.
 * Reports WHICH settings exist and whether Shopify accepts them.
 * Never returns the values themselves.
 */
export async function subscribeStatus(): Promise<Response> {
  const env = {
    SHOPIFY_ADMIN_DOMAIN: Boolean(process.env.SHOPIFY_ADMIN_DOMAIN),
    NEXT_PUBLIC_SHOPIFY_DOMAIN: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN),
    SHOPIFY_ADMIN_TOKEN: Boolean(process.env.SHOPIFY_ADMIN_TOKEN),
    SHOPIFY_CLIENT_ID: Boolean(process.env.SHOPIFY_CLIENT_ID),
    SHOPIFY_CLIENT_SECRET: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
  };
  const domain = shopDomain();
  let shopify: string;
  let fix: string | null = null;

  if (!domain) {
    shopify = 'no store domain';
    fix = 'Add SHOPIFY_ADMIN_DOMAIN (e.g. b7kkzm-cj.myshopify.com) in Vercel → Settings → Environment Variables, then redeploy.';
  } else if (!env.SHOPIFY_ADMIN_TOKEN && !(env.SHOPIFY_CLIENT_ID && env.SHOPIFY_CLIENT_SECRET)) {
    shopify = 'no admin credentials';
    fix = 'Add SHOPIFY_ADMIN_TOKEN (or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET) in Vercel, then redeploy.';
  } else {
    try {
      const d = await admin<{ shop: { name: string } }>(`{ shop { name } }`);
      shopify = `connected to "${d.shop.name}"`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      shopify = 'credentials rejected';
      if (/shop_not_permitted/i.test(msg)) {
        fix = 'Client ID/secret only work for a Dev Dashboard app. This app needs SHOPIFY_ADMIN_TOKEN instead.';
      } else if (/401|403|Invalid API key|access token/i.test(msg)) {
        fix = 'Token/credentials are wrong or the app lacks read_customers + write_customers scopes.';
      } else if (/404/.test(msg)) {
        fix = 'Store domain is wrong. Use the *.myshopify.com domain, not checkout.artisunskin.com.';
      } else {
        fix = msg.slice(0, 200);
      }
    }
  }

  return new Response(JSON.stringify({ ok: !fix, domain: domain || null, env, shopify, fix }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
