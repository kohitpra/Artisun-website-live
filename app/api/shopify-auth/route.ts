import { handleShopifyAuth } from '@/lib/shopify-auth-handler';

// One-time setup page for a permanent Shopify Admin token (Partner app).
// Returns 404 unless SHOPIFY_AUTH_SETUP=on. See lib/shopify-auth-handler.ts.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handleShopifyAuth(req);
}
