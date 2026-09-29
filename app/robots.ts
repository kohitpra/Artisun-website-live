import { MetadataRoute } from 'next';

// Required by Next 15 for the static export; it's static on the server build too.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/orders/*',
          '/api/*',
          '/*?*preview=*',
        ],
      },
    ],
    sitemap: 'https://artisunskin.com/sitemap.xml',
    host: 'https://artisunskin.com',
  };
}
