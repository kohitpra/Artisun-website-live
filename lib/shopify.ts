/**
 * Shopify Storefront API — Headless Storefront channel.
 *
 * ── TOKENS ────────────────────────────────────────────────────────
 * The Headless app gives you two tokens and they are NOT interchangeable.
 *
 *   PUBLIC access token   safe in the browser. This is the one we use.
 *                         IP rate-limited, scoped to storefront reads and
 *                         cart mutations.
 *
 *   PRIVATE access token  server only. Never prefix it NEXT_PUBLIC_ — that
 *                         compiles it into the client bundle, where anyone can
 *                         read it from DevTools. It is not rate-limited and
 *                         carries elevated scopes, so a leaked private token
 *                         can be used to scrape the catalogue and exhaust the
 *                         store's API limits. Nothing here needs it. If it has
 *                         already shipped in client code, rotate it.
 *
 * .env.local
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN=<Public access token>
 *
 * Next reads env only at boot — restart `npm run dev` after editing.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? '';
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN ?? '';
const ENDPOINT = `https://${DOMAIN}/api/2025-01/graphql.json`;

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

export type Money = { amount: string; currencyCode: string };

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  variants: { nodes: Variant[] };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    price: Money;
    image: { url: string; altText: string | null } | null;
    product: { title: string; handle: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
};

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyConfigured) {
    throw new Error(
      'Shopify is not configured. Add NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN to .env.local, then restart the dev server.',
    );
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(
      res.status === 401 || res.status === 403
        ? 'Shopify rejected the token. Check you used the PUBLIC access token, and that both products are published to the Headless channel.'
        : `Shopify responded ${res.status}`,
    );
  }

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

/* ─────────────────────────── products ─────────────────────────── */

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    featuredImage { url altText }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`;

export const getAllProducts = () =>
  gql<{ products: { nodes: Product[] } }>(
    `${PRODUCT_FIELDS}
     query All { products(first: 30) { nodes { ...ProductFields } } }`,
  ).then((d) => d.products.nodes);

export type Catalogue = { origin: Product | null; aura: Product | null };

/**
 * Resolve the two products by TITLE PREFIX rather than handle.
 *
 * Your titles are:
 *   "Origin 4-in-1 Milk Emulsion Skinwear Sunscreen with SPF 50+ PA++++"
 *   "Aura Pearl Skinwear Sunscreen with SPF 40 PA++++"
 *
 * Shopify strips "+" when it auto-generates handles, so the Origin handle ends
 * up something like `origin-4-in-1-milk-emulsion-skinwear-sunscreen-with-spf-50-pa`.
 * Hardcoding that is easy to get wrong and it breaks silently the moment anyone
 * edits the title in admin. Matching the first word survives both.
 */
export async function getCatalogue(): Promise<Catalogue> {
  const all = await getAllProducts();
  const find = (prefix: string) =>
    all.find((p) => p.title.trim().toLowerCase().startsWith(prefix)) ?? null;
  return { origin: find('origin'), aura: find('aura') };
}

export const firstVariant = (p: Product | null): Variant | null =>
  p ? p.variants.nodes.find((v) => v.availableForSale) ?? p.variants.nodes[0] ?? null : null;

export const formatPrice = (m: Money) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: m.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(m.amount));

/* ───────────────────────────── cart ───────────────────────────── */

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
`;

const unwrap =
  (key: string) =>
  (d: Record<string, { cart: Cart; userErrors?: { message: string }[] }>) => {
    const node = d[key];
    if (node.userErrors?.length) throw new Error(node.userErrors[0].message);
    return node.cart;
  };

export const createCart = (variantId?: string, quantity = 1) =>
  gql(
    `${CART_FIELDS}
     mutation Create($lines: [CartLineInput!]) {
       cartCreate(input: { lines: $lines }) {
         cart { ...CartFields }
         userErrors { message }
       }
     }`,
    { lines: variantId ? [{ merchandiseId: variantId, quantity }] : [] },
  ).then(unwrap('cartCreate') as never) as Promise<Cart>;

export const getCart = (cartId: string) =>
  gql<{ cart: Cart | null }>(
    `${CART_FIELDS}
     query Get($cartId: ID!) { cart(id: $cartId) { ...CartFields } }`,
    { cartId },
  ).then((d) => d.cart);

export const addLine = (cartId: string, variantId: string, quantity = 1) =>
  gql(
    `${CART_FIELDS}
     mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) {
         cart { ...CartFields }
         userErrors { message }
       }
     }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  ).then(unwrap('cartLinesAdd') as never) as Promise<Cart>;

export const updateLine = (cartId: string, lineId: string, quantity: number) =>
  gql(
    `${CART_FIELDS}
     mutation Upd($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) {
         cart { ...CartFields }
         userErrors { message }
       }
     }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  ).then(unwrap('cartLinesUpdate') as never) as Promise<Cart>;

export const removeLine = (cartId: string, lineId: string) =>
  gql(
    `${CART_FIELDS}
     mutation Rm($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
         cart { ...CartFields }
         userErrors { message }
       }
     }`,
    { cartId, lineIds: [lineId] },
  ).then(unwrap('cartLinesRemove') as never) as Promise<Cart>;
