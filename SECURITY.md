# Security notes — artisunskin.com

## What changed (security-hardening branch, Sep 2026)

| Area | Before | After |
|---|---|---|
| Next.js | 14.2.35 — 23 advisories incl. 2 critical RCEs (AVIF image optimizer, Windows fs) | 15.5.26, `npm audit` = 0 |
| React / R3F | React 18, fiber 8, drei 9 | React 19.2.8, fiber 9.8, drei 10.7 (required by Next 15) |
| `/api/subscribe` POST | Anyone, any origin, unlimited; could set SMS consent / phone on any customer | Origin check, JSON-only, 2 KB body cap, rate limits (5/10 min per IP, 3/h per email, 60/min global), optional Cloudflare Turnstile, strict email validation, exact-match customer lookup, never re-subscribes an UNSUBSCRIBED customer, phone/SMS removed |
| `/api/subscribe` GET | Public: showed store domain, env vars, raw Shopify errors | 404 unless `?key=` matches `SUBSCRIBE_STATUS_KEY` |
| Blog HTML | Raw Shopify HTML rendered as-is | Allowlist-sanitised on the server (`lib/sanitize-content.ts`); `javascript:` links neutralised; look-alike domains no longer treated as ours |
| Headers | HSTS, nosniff, XFO, Referrer | + Permissions-Policy, COOP, CSP (see below), no `X-Powered-By`; static export now gets them via `.htaccess` |
| Build | `ignoreBuildErrors: true` | Type errors fail the build |
| GitHub Pages | Export build was failing on `/api/*` | `npm run build:static` parks `app/api` during export |

## Deploy checklist (Hostinger Node.js)

1. **Node 20.9+** in hPanel → Websites → your Node.js app → settings.
2. Deploy the branch; build command `npm run build`, start command `npm start`.
3. **Environment variables** (hPanel → Node.js app → Environment variables):
   - Keep: `SHOPIFY_ADMIN_DOMAIN`, `SHOPIFY_ADMIN_TOKEN` (or `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET`), `NEXT_PUBLIC_SHOPIFY_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN`.
   - **Delete `SHOPIFY_AUTH_SETUP`** if it is there. `/api/shopify-auth` must return 404.
   - Add `SUBSCRIBE_STATUS_KEY` = a long random string (e.g. from `openssl rand -hex 24`).
   - Optional, recommended: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (Cloudflare → Turnstile → Add site, free). `NEXT_PUBLIC_*` values are read at **build** time — rebuild after setting.
   - If signups come from any domain other than artisunskin.com / www.artisunskin.com (e.g. a Hostinger preview URL), add it to `ALLOWED_ORIGINS`.
4. After deploy, check:
   - `https://artisunskin.com/api/subscribe` → 404
   - `https://artisunskin.com/api/subscribe?key=YOUR_KEY` → `"ok": true`
   - `https://artisunskin.com/api/shopify-auth` → 404
   - Sign up with a test email from the footer and the popup → appears in Shopify → Customers.
   - A blog post renders normally.

## Content-Security-Policy rollout

`security-headers.mjs` sends:

- an **enforced** CSP with the directives that can't break anything (`object-src 'none'`, `base-uri`, `frame-ancestors`, `form-action`, `upgrade-insecure-requests`), and
- the **full host allowlist as Report-Only**.

For about a week, open the site with DevTools → Console and click around (home, PDPs, cart → checkout, climate page, blog, popup). Any line starting with `[Report Only]` names a host a GTM tag or feature needs. Add it with `CSP_EXTRA_HOSTS=https://host.example` (build-time env), then set `CSP_ENFORCE=1` and rebuild.

Anything new added in Google Tag Manager later may need a host added the same way.

## Things this repo can't fix for you

- **Shopify staff accounts** — the blog sanitiser limits the damage, but use 2FA on every Shopify staff account and give freelancers the minimum permissions.
- **Rotate `SHOPIFY_ADMIN_TOKEN`** if it has ever been pasted into chat, email, a screenshot, or a file in this repo's history.
- **Keep Next.js patched.** Run `npm audit` monthly; GitHub → Settings → Code security → enable Dependabot alerts.
- Rate limits are in-memory, which is right for a single long-running Node process (Hostinger). On a serverless host, enable Turnstile.
