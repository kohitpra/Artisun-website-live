/**
 * Security headers for artisunskin.com, used by next.config.mjs.
 *
 * CONTENT-SECURITY-POLICY — two layers:
 *
 *   1. ALWAYS ENFORCED — directives that can't break the site:
 *      object-src 'none', base-uri 'self', frame-ancestors 'self',
 *      form-action, upgrade-insecure-requests.
 *
 *   2. FULL ALLOWLIST — which hosts may serve scripts, receive data, etc.
 *      Sent as Content-Security-Policy-Report-Only by default: the browser
 *      logs what it WOULD block in DevTools → Console but blocks nothing.
 *      Marketing tags added through Google Tag Manager can pull in new
 *      domains at any time, so watch the console for a week, add any missing
 *      hosts via CSP_EXTRA_HOSTS, then set CSP_ENFORCE=1 and rebuild.
 *
 * Why 'unsafe-inline' for scripts: the GTM / GA4 / Meta / Clarity snippets
 * and Next's own bootstrap are inline. Removing it needs per-request nonces,
 * which forces every page to render dynamically (no static/ISR caching) and
 * doesn't work with the static export. The blog HTML is sanitised on the
 * server instead (lib/sanitize-content.ts), which is the real XSS defence;
 * this policy limits where an injected script could load code from or send
 * data to.
 *
 * Environment (build time):
 *   CSP_ENFORCE=1        enforce the full allowlist instead of report-only
 *   CSP_EXTRA_HOSTS      comma/space separated https:// origins to allow for
 *                        scripts, connections, frames and media
 */

const shopifyDomain = (process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '')
  .trim();

const extraHosts = (process.env.CSP_EXTRA_HOSTS || '')
  .split(/[\s,]+/)
  .map((s) => s.trim())
  // Only accept things that look like https origins, so a typo can't inject
  // a directive or a keyword like 'unsafe-eval'.
  .filter((s) => /^https:\/\/[a-z0-9*.-]+(:\d+)?$/i.test(s));

const isDev = process.env.NODE_ENV !== 'production';

const SHOPIFY = [
  'https://checkout.artisunskin.com',
  'https://*.myshopify.com',
  'https://cdn.shopify.com',
  'https://monorail-edge.shopifysvc.com',
  ...(shopifyDomain && /^[a-z0-9.-]+$/i.test(shopifyDomain) ? [`https://${shopifyDomain}`] : []),
];
const GOOGLE = [
  'https://www.googletagmanager.com',
  'https://*.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.g.doubleclick.net',
  'https://www.google.com',
];
const META = ['https://connect.facebook.net', 'https://www.facebook.com'];
const CLARITY = ['https://www.clarity.ms', 'https://*.clarity.ms', 'https://c.bing.com'];
const TURNSTILE = ['https://challenges.cloudflare.com'];
// Used by the climate page (weather lookup) and the map section.
const DATA_APIS = ['https://ipapi.co', 'https://api.open-meteo.com', 'https://cdn.jsdelivr.net'];

const join = (...parts) => [...new Set(parts.flat())].join(' ');

const baseDirectives = [
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  `form-action 'self' https://checkout.artisunskin.com`,
  'upgrade-insecure-requests',
];

const allowlistDirectives = [
  "default-src 'self'",
  `script-src ${join("'self'", "'unsafe-inline'", isDev ? ["'unsafe-eval'"] : [], GOOGLE, META, CLARITY, TURNSTILE, extraHosts)}`,
  "style-src 'self' 'unsafe-inline'",
  // Tracking pixels come from many hosts; images can't run code.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${join("'self'", isDev ? ['ws:', 'wss:'] : [], SHOPIFY, GOOGLE, META, CLARITY, TURNSTILE, DATA_APIS, extraHosts)}`,
  `media-src ${join("'self'", 'blob:', 'https://cdn.shopify.com', extraHosts)}`,
  `frame-src ${join(
    "'self'",
    'https://www.googletagmanager.com',
    TURNSTILE,
    'https://www.youtube-nocookie.com',
    'https://www.youtube.com',
    'https://player.vimeo.com',
    'https://www.facebook.com',
    extraHosts,
  )}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
];

const enforce = process.env.CSP_ENFORCE === '1';

/** Headers applied to every route by next.config.mjs. */
export function securityHeaders() {
  const headers = [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    },
    // same-origin-allow-popups keeps Shopify checkout / social login popups working.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  ];

  if (enforce) {
    headers.push({ key: 'Content-Security-Policy', value: [...allowlistDirectives, ...baseDirectives].join('; ') });
  } else {
    headers.push({ key: 'Content-Security-Policy', value: baseDirectives.join('; ') });
    headers.push({
      key: 'Content-Security-Policy-Report-Only',
      // upgrade-insecure-requests is ignored (with a warning) in report-only.
      value: [...allowlistDirectives, ...baseDirectives.filter((d) => d !== 'upgrade-insecure-requests')].join('; '),
    });
  }
  return headers;
}
