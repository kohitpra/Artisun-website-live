# Artisun — artisunskin.com

Next.js 14 (App Router) site for Artisun Skinwear, hosted on **Vercel**.
Shopify is the backend for products, cart, checkout, blog posts and newsletter
sign-ups; this repo is only the storefront. Checkout itself runs on Shopify at
`checkout.artisunskin.com`.

```bash
npm install
# create .env.local with the variables listed under "Environment variables"
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build locally
```

---

## How Shopify connects

| What | How | Code |
|---|---|---|
| Products, prices, stock | Shopify **Storefront API** (Headless sales channel), fetched in the browser | `lib/shopify.ts` → `getCatalogue()` |
| Cart | Storefront API cart mutations; cart id kept in `localStorage` | `components/cart/CartProvider.tsx` |
| Checkout | "Checkout" sends the shopper to the Shopify cart's `checkoutUrl` (`checkout.artisunskin.com`) | `components/cart/CartProvider.tsx` |
| Product barcode (gtin13 in schema) | Storefront API, read at build/revalidate time | `lib/shopify.ts` → `getVariantGtin13()` |
| Blog ("Artifacts") | Storefront API, blog handle `artifacts` | `lib/journal.ts` |
| Newsletter popup + footer sign-up | `POST /api/subscribe` → Shopify **Admin API** creates/updates a customer with email marketing = subscribed, tag `newsletter-popup` | `app/api/subscribe/route.ts`, `lib/subscribe-handler.ts` |
| Browse analytics | Shopify analytics events via `@shopify/hydrogen-react` | `components/analytics/RouteAnalytics.tsx` |

Origin and Aura are matched by their Shopify **product IDs** (`lib/tracking-config.ts`),
falling back to the title prefix "Origin"/"Aura". The Weather Duo combo is product
`8395873878079` (`DUO_PRODUCT_GID` in `lib/shopify.ts`).

**For products to appear on the site they must be published to the Headless sales
channel in Shopify admin** (Products → product → Publishing).

## How blog posts publish

1. In Shopify admin → **Content → Blog posts**, write the post in the **Artifacts** blog and set it to *Visible*.
2. The site picks it up automatically: blog pages revalidate every **5 minutes** (`REVALIDATE` in `lib/journal.ts`). No redeploy needed.
3. URL: `artisunskin.com/blog/<post-handle>`.

Fields the site uses:

- **Title, content, excerpt, featured image, tags, published date**: standard Shopify fields.
- **Author**: write it as `Name — Role` (e.g. `Dr. Reetu Durga — Aesthetician and Founder, Skulpted by Kan`). The site splits it into the schema's `name` and `jobTitle`.
- **SEO title / description**: the post's "Search engine listing" in Shopify.
- **Optional metafields** (namespace `custom`): `answer_block` (short answer shown at the top and used as meta description), `author_role` (overrides the role from the author field), `reviewed_by`, `sources`, `faq`.
- If a post has no featured image, `og-home.jpg` is used for social cards and schema.
- Any `<script type="application/ld+json">` pasted into a post body is stripped when rendering; the page outputs its own Article, FAQ and Breadcrumb schema.

## How to redeploy

- **Automatic:** every push to `main` deploys to production on Vercel.
- **Manual:** Vercel → project → *Deployments* → latest → **⋯ → Redeploy**.
- **Env var changes** only take effect after a redeploy.
- Blog and product data update on their own (see above); a redeploy is only needed for code or copy changes.

## Where the content lives

| Content | File |
|---|---|
| Origin page sections | `components/origin/*` (hero, why, where, what's in it, FAQs), page layout in `app/origin/page.tsx` |
| **Origin full ingredient list (INCI)** | `components/origin/OriginHero.tsx` → `FULL_INGREDIENTS` |
| Origin stats (20%, 72 hrs, 98%, 0, 4 weeks) | `components/origin/OriginWhy.tsx` → `STATS` |
| **Origin FAQs** | `components/origin/OriginQuestions.tsx` |
| Aura page sections | `components/aura/*`, page layout in `app/aura/page.tsx` |
| **Aura full ingredient list (INCI)** | `components/aura/AuraHero.tsx` → `FULL_INGREDIENTS` **and** the "What's in Aura?" answer in `components/aura/AuraQuestions.tsx` (keep both identical) |
| **Aura FAQs** | `components/aura/AuraQuestions.tsx` |
| Main FAQ page | `components/faq/artisunmainfaq.tsx` |
| Product SEO title/description/Product schema | `app/origin/layout.tsx`, `app/aura/layout.tsx` |
| Home page | `app/page.tsx` + `components/*Section.tsx` |
| Footer (links, email, socials) | `components/Footer.tsx` |
| Signup popup | `components/SignupPopup.tsx` |
| Policies | `components/privacypolicy`, `components/terms`, `components/shipping` |
| Organization schema, site-wide meta, viewport | `app/layout.tsx` |
| Tracking IDs (GTM, GA4, Meta Pixel, Clarity) and product/variant IDs | `lib/tracking-config.ts` |
| Old-URL 301 redirects | `next.config.mjs` → `redirects()` |
| Sitemap / robots | `app/sitemap.ts`, `app/robots.ts` |
| Images, video, fonts | `public/` |

## Environment variables (Vercel → Settings → Environment Variables)

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | Yes | Store domain, e.g. `yourstore.myshopify.com`. Used for all Storefront API calls. |
| `NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN` | Yes | Headless channel **public** Storefront token (safe in the browser). Never put the private token here. |
| `SHOPIFY_ADMIN_TOKEN` | Yes* | Admin API token for `/api/subscribe` (scopes `read_customers`, `write_customers`). Server-only. |
| `SHOPIFY_CLIENT_ID` / `SHOPIFY_CLIENT_SECRET` | Yes* | Alternative to `SHOPIFY_ADMIN_TOKEN`: app credentials; the server exchanges them for a token. |
| `SHOPIFY_ADMIN_DOMAIN` | No | Store domain for Admin API if it differs; falls back to `NEXT_PUBLIC_SHOPIFY_DOMAIN`. |
| `SHOPIFY_AUTH_SETUP` | No | Set to `on` **temporarily** to enable `/api/shopify-auth`, a one-off page that generates an Admin token. Remove afterwards (the page then 404s). |
| `SHOPIFY_AUTH_REDIRECT_URL` | No | Overrides the OAuth callback URL for that setup page. |
| `NEXT_PUBLIC_SHOPIFY_BLOG_HANDLE` | No | Blog to pull posts from. Default `artifacts`. |
| `NEXT_PUBLIC_SUBSCRIBE_ENDPOINT` | No | Override for the sign-up endpoint. Default `/api/subscribe`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification meta tag. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | No | Bing Webmaster verification meta tag. |
| `NEXT_PUBLIC_BASE_PATH` | No | Only for the GitHub Pages static preview. Must be **empty** on Vercel. |
| `STATIC_EXPORT` | No | Only for the GitHub Pages static preview (`1`). Leave unset on Vercel; redirects and API routes don't work in static mode. |

\* One of `SHOPIFY_ADMIN_TOKEN` **or** `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` is needed for newsletter sign-ups.

## Other hosting files

- `.github/workflows/deploy-pages.yml`: optional static preview on GitHub Pages. Not production.
- `netlify.toml`, `netlify/`: legacy Netlify setup. Not production.
- `public/.htaccess`: only used if the static export is uploaded to an Apache host.
