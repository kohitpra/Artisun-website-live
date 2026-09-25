// Static-export mode (STATIC_EXPORT=1) builds a fully static site into `out/`
// for hosts like GitHub Pages. NEXT_PUBLIC_BASE_PATH must then be set to the
// subpath the site is served from (e.g. /artisun) — it drives both Next's
// basePath and the asset() helper in lib/asset.ts.
const isExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  compress: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  ...(isExport && {
    output: 'export',
    basePath,
    // Emit `origin/index.html` rather than `origin.html`. Apache (GoDaddy
    // cPanel) serves a directory's index.html for `/origin/` with no config;
    // without this, every route except `/` 404s on a plain static host.
    trailingSlash: true,
  }),
  images: {
    formats: ['image/webp', 'image/avif'],
    // next/image optimization needs a server; export mode serves originals.
    ...(isExport && { unoptimized: true }),
  },

  async redirects() {
    if (isExport) return [];
    return [
      {
        source: '/shop',
        destination: '/collection',
        statusCode: 301,
      },
      {
        source: '/collections/all',
        destination: '/collection',
        statusCode: 301,
      },
      {
        source: '/privacypolicy',
        destination: '/privacy',
        statusCode: 301,
      },
      {
        source: '/shipping',
        destination: '/shipping-returns',
        statusCode: 301,
      },

      // ── Old Shopify storefront URLs → new site ─────────────────────────────
      // statusCode 301 (not `permanent: true`, which makes Next send 308).
      // Order matters: specific rules first, catch-alls last.

      // Products
      { source: '/products/origin', destination: '/origin', statusCode: 301 },
      { source: '/products/aura', destination: '/aura', statusCode: 301 },
      // Collection-scoped product URLs Shopify also generates
      { source: '/collections/:collection/products/origin', destination: '/origin', statusCode: 301 },
      { source: '/collections/:collection/products/aura', destination: '/aura', statusCode: 301 },
      // Any other old product handle → shop page
      // Shopify handles never contain a dot, so this skips real files such as
      // /products/origin-square.webp (home showcase, og:image, Product schema image),
      // which the old `/products/:handle*` pattern was redirecting to /collection.
      { source: '/products/:handle([^./]+)', destination: '/collection', statusCode: 301 },
      { source: '/collections/:path*', destination: '/collection', statusCode: 301 },
      { source: '/collections', destination: '/collection', statusCode: 301 },

      // Blog. The Journal lives at /blog and articles at /blog/{handle}
      // (handles come from the Shopify "artifacts" blog).
      { source: '/blogs/artisun', destination: '/blog', statusCode: 301 },
      { source: '/blogs/artifacts', destination: '/blog', statusCode: 301 },
      { source: '/blogs/:blog/tagged/:tag*', destination: '/blog', statusCode: 301 },
      { source: '/blogs/artisun/:handle', destination: '/blog/:handle', statusCode: 301 },
      { source: '/blogs/artifacts/:handle', destination: '/blog/:handle', statusCode: 301 },
      { source: '/blogs/:path*', destination: '/blog', statusCode: 301 },

      // Shopify pages
      { source: '/pages/contact', destination: '/contact', statusCode: 301 },
      { source: '/pages/contact-us', destination: '/contact', statusCode: 301 },
      { source: '/pages/faq', destination: '/faq', statusCode: 301 },
      { source: '/pages/faqs', destination: '/faq', statusCode: 301 },
      { source: '/pages/about', destination: '/about', statusCode: 301 },
      { source: '/pages/about-us', destination: '/about', statusCode: 301 },
      { source: '/pages/shipping', destination: '/shipping-returns', statusCode: 301 },
      { source: '/pages/shipping-policy', destination: '/shipping-returns', statusCode: 301 },
      { source: '/pages/:path*', destination: '/', statusCode: 301 },

      // Shopify policies
      { source: '/policies/privacy-policy', destination: '/privacy', statusCode: 301 },
      { source: '/policies/terms-of-service', destination: '/terms', statusCode: 301 },
      { source: '/policies/refund-policy', destination: '/shipping-returns', statusCode: 301 },
      { source: '/policies/shipping-policy', destination: '/shipping-returns', statusCode: 301 },
      { source: '/policies/contact-information', destination: '/contact', statusCode: 301 },
      { source: '/policies/:path*', destination: '/terms', statusCode: 301 },

      // Add any extra URLs from the Search Console "Pages" export below.
    ];
  },

  async headers() {
    // headers() has no effect in a static export (no server to set them);
    // GitHub Pages applies its own caching.
    if (isExport) return [];

    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ];

    // In development the chunk/asset URLs are stable across rebuilds, so an
    // `immutable` cache makes the browser keep stale JS/CSS forever (code edits
    // never show up without a hard refresh). Only apply long-term caching in
    // production, where filenames are content-hashed.
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
        {
          source: '/:path*.(js|css)',
          headers: [
            { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          ],
        },
      ];
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/:path*.mp4',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.(png|jpg|jpeg|webp|glb|svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
