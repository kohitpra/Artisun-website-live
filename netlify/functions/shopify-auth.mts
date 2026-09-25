/**
 * One-time Shopify token setup — Netlify entry point.
 * Logic lives in lib/shopify-auth-handler.ts (also served on Vercel at /api/shopify-auth).
 */
import { handleShopifyAuth } from '../../lib/shopify-auth-handler';

export default handleShopifyAuth;
