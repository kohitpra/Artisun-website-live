/**
 * ONE-TIME SETUP: get a permanent Shopify Admin API token for an app created
 * in the Partner Dashboard (custom distribution).
 *
 * Partner apps can't use the client-credentials login on a merchant's store
 * (Shopify returns "shop_not_permitted"). They need the normal install
 * approval ("authorization code grant"), which gives a permanent token.
 * This page does that once and shows you the token so you can save it as
 * SHOPIFY_ADMIN_TOKEN.
 *
 * Served at:
 *   Vercel   /api/shopify-auth              (app/api/shopify-auth/route.ts)
 *   Netlify  /.netlify/functions/shopify-auth
 *
 * It only runs while the environment variable SHOPIFY_AUTH_SETUP is "on".
 * Remove that variable when you're done — the page then returns 404.
 *
 * Needs:
 *   SHOPIFY_AUTH_SETUP     on            (temporary)
 *   SHOPIFY_ADMIN_DOMAIN   yourstore.myshopify.com
 *   SHOPIFY_CLIENT_ID      from the app
 *   SHOPIFY_CLIENT_SECRET  from the app
 *
 * App settings (Partner Dashboard → app → Configuration):
 *   App URL        https://YOUR-SITE/api/shopify-auth
 *   Redirect URL   https://YOUR-SITE/api/shopify-auth
 *   Scopes         read_customers, write_customers
 *   Embed in Shopify admin: OFF
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const SCOPES = 'read_customers,write_customers';
const STATE_COOKIE = 'artisun_shopify_oauth_state';

const html = (body: string, status = 200, headers: Record<string, string> = {}) =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Shopify setup</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 20px;line-height:1.6;color:#180307">${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...headers } },
  );

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function expectedShop(): string {
  return (process.env.SHOPIFY_ADMIN_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
}

/** Shopify signs its redirects: HMAC-SHA256 of the other params, sorted, with the app secret. */
function validHmac(params: URLSearchParams, secret: string): boolean {
  const given = params.get('hmac') || '';
  const message = [...params.entries()]
    .filter(([k]) => k !== 'hmac' && k !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  const digest = createHmac('sha256', secret).update(message).digest('hex');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(given, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

function readCookie(req: Request, name: string): string | null {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function handleShopifyAuth(req: Request): Promise<Response> {
  if (process.env.SHOPIFY_AUTH_SETUP !== 'on') return new Response('Not found', { status: 404 });

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  const shopEnv = expectedShop();
  if (!clientId || !secret || !shopEnv) {
    return html('<h1>Setup incomplete</h1><p>Add SHOPIFY_ADMIN_DOMAIN, SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET in your hosting settings (Vercel / Hostinger → Environment Variables), redeploy, then try again.</p>', 500);
  }

  const url = new URL(req.url);
  const params = url.searchParams;
  const shop = (params.get('shop') || shopEnv).toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop) || shop !== shopEnv) {
    return html(`<h1>Wrong store</h1><p>This setup only works for <b>${escapeHtml(shopEnv)}</b>.</p>`, 400);
  }

  // The exact return address Shopify must send the browser back to. It has to
  // match the app's "Allowed redirection URL" character for character.
  // Behind a proxy (Hostinger, most Node hosts) req.url is the INTERNAL address
  // (http://localhost:3000/...), so we don't trust it:
  //   1. SHOPIFY_AUTH_REDIRECT_URL, if set, wins (e.g. https://artisunskin.com/api/shopify-auth)
  //   2. otherwise the public host/proto the proxy forwarded
  //   3. otherwise req.url, forced to https
  const fwdHost = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim();
  const fwdProto = (req.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  const publicHost = fwdHost && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(fwdHost) ? fwdHost : url.host;
  const callback =
    process.env.SHOPIFY_AUTH_REDIRECT_URL?.trim() ||
    `${fwdProto === 'http' && /^(localhost|127\.)/.test(publicHost) ? 'http' : 'https'}://${publicHost}${url.pathname}`;

  // ── Step 2: Shopify sent us back with a code → exchange it for a permanent token ──
  if (params.get('code')) {
    const state = params.get('state');
    const cookieState = readCookie(req, STATE_COOKIE);
    if (!validHmac(params, secret) || !state || state !== cookieState) {
      return html('<h1>Check failed</h1><p>The request could not be verified. Start again from the install link.</p>', 400);
    }

    const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: secret, code: params.get('code') }),
    });
    if (!res.ok) {
      return html(`<h1>Shopify refused the request</h1><pre style="white-space:pre-wrap">${escapeHtml(await res.text())}</pre>`, 502);
    }
    const data = (await res.json()) as { access_token?: string; scope?: string };
    if (!data.access_token) return html('<h1>No token returned</h1><p>Try the install link again.</p>', 502);

    return html(
      `<h1>Done. Here is your permanent token</h1>
       <p>Copy it now. It is shown only this once.</p>
       <p style="background:#f4ede3;border:1px solid #cbbba9;padding:14px;word-break:break-all;font-family:monospace;font-size:15px">${escapeHtml(data.access_token)}</p>
       <p>Scopes granted: <code>${escapeHtml(data.scope || '')}</code></p>
       <ol>
         <li>In Vercel → Settings → Environment Variables, add <b>SHOPIFY_ADMIN_TOKEN</b> with this value (all environments).</li>
         <li>Delete the <b>SHOPIFY_AUTH_SETUP</b> variable so this page switches off.</li>
         <li>Deployments → ⋯ on the latest → <b>Redeploy</b>.</li>
         <li>Open <code>/api/subscribe</code> and check it says <code>"ok": true</code>.</li>
       </ol>
       <p>Never share this token or put it in website code.</p>`,
      200,
      { 'Set-Cookie': `${STATE_COOKIE}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax` },
    );
  }

  // ── Step 1: opened from the install / app URL → send to Shopify's approval screen ──
  if (params.get('hmac') && !validHmac(params, secret)) {
    return html('<h1>Check failed</h1><p>The request could not be verified.</p>', 400);
  }
  const state = randomBytes(16).toString('hex');
  const authorize = new URL(`https://${shop}/admin/oauth/authorize`);
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('scope', SCOPES);
  authorize.searchParams.set('redirect_uri', callback);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; Secure; HttpOnly; SameSite=Lax`,
      'Cache-Control': 'no-store',
    },
  });
}
