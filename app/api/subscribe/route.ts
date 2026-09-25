import { handleSubscribe, subscribeStatus } from '@/lib/subscribe-handler';

// POST /api/subscribe — signup popup + footer newsletter.
// GET  /api/subscribe — setup check (which env vars are set, does Shopify accept them).
// Always runs on the server (Node runtime) so Shopify Admin credentials stay private.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return handleSubscribe(req);
}

export async function GET() {
  return subscribeStatus();
}
