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

  async headers() {
    // headers() has no effect in a static export (no server to set them);
    // GitHub Pages applies its own caching.
    if (isExport) return [];

    // In development the chunk/asset URLs are stable across rebuilds, so an
    // `immutable` cache makes the browser keep stale JS/CSS forever (code edits
    // never show up without a hard refresh). Only apply long-term caching in
    // production, where filenames are content-hashed.
    if (process.env.NODE_ENV !== 'production') {
      return [
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
