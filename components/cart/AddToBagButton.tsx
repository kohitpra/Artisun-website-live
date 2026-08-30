'use client';

import { useCart } from '@/components/cart/CartProvider';
import { firstVariant, formatPrice } from '@/lib/shopify';

/**
 * AddToBagButton — the single place any "Add to bag" on the site is wired.
 *
 * Every buy button used to be its own bare <button> with no handler, which
 * meant seven different places could each drift out of sync with the cart.
 * They now all render this, so the states below are guaranteed consistent
 * wherever a visitor happens to click:
 *
 *   catalogue loading  → disabled, "Loading…"
 *   Shopify not set up → disabled, "Unavailable" (rather than a button that
 *                        looks live and silently does nothing)
 *   variant sold out   → disabled, "Sold out"
 *   mid-request        → disabled, "Adding…"
 *
 * `className` is passed straight through so each placement keeps the exact
 * styling it already had — this changes behaviour, not design.
 */
export default function AddToBagButton({
  product,
  className = '',
  label = 'Add to bag',
  showPrice = false,
  quantity = 1,
}: {
  /** Which of the two products this button buys. */
  product: 'origin' | 'aura';
  className?: string;
  /** Override the resting label, e.g. "Buy now". */
  label?: string;
  /** Append the live Shopify price to the label. */
  showPrice?: boolean;
  quantity?: number;
}) {
  const { add, products, loadingProducts, busy, configured } = useCart();

  const shopProduct = product === 'origin' ? products.origin : products.aura;
  const variant = firstVariant(shopProduct);

  const soldOut = Boolean(variant && !variant.availableForSale);
  const disabled = !configured || loadingProducts || busy || !variant || soldOut;

  const text = !configured
    ? 'Unavailable'
    : loadingProducts
      ? 'Loading…'
      : soldOut
        ? 'Sold out'
        : busy
          ? 'Adding…'
          : showPrice && variant
            ? `${label} — ${formatPrice(variant.price)}`
            : label;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={busy}
      onClick={() => variant && add(variant.id, quantity)}
      className={`${className} disabled:opacity-55 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
}
