'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/shopify';

export default function CartDrawer() {
  const { cart, open, setOpen, setQty, remove, checkout, busy, error, configured } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const lines = cart?.lines.nodes ?? [];

  return (
    <>
      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        data-lenis-prevent="true"
        role="dialog"
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[140] flex h-[100dvh] w-full max-w-[420px] flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #5A190D 0%, #3A0F07 55%, #1F0704 100%)',
          color: 'var(--brand-cream, #f5f0eb)',
        }}
      >
        <header className="flex items-center justify-between border-b border-white/12 px-5 py-4">
          <h2 className="font-editorial text-[22px] tracking-tight">
            Your bag{cart?.totalQuantity ? ` (${cart.totalQuantity})` : ''}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {!configured && (
            <p className="mt-5 rounded border border-[#edc6a2]/40 bg-black/25 px-3 py-3 font-suisse text-[13px] leading-relaxed">
              Shopify isn&rsquo;t connected yet. Add <code>NEXT_PUBLIC_SHOPIFY_DOMAIN</code> and{' '}
              <code>NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN</code> to <code>.env.local</code>, then restart
              the dev server.
            </p>
          )}

          {error && (
            <p className="mt-5 rounded border border-[#edc6a2]/40 bg-black/25 px-3 py-2 font-suisse text-[13px]">
              {error}
            </p>
          )}

          {configured && lines.length === 0 && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-suisse text-[15px] text-white/60">Your bag is empty.</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-none border border-white/30 px-6 py-2.5 font-suisse text-[13px] uppercase tracking-wider transition-colors hover:bg-white/10"
              >
                Keep looking
              </button>
            </div>
          )}

          {lines.length > 0 && (
            <ul className="divide-y divide-white/10">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-4">
                  {l.merchandise.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={l.merchandise.image.url}
                      alt={l.merchandise.image.altText ?? ''}
                      className="h-20 w-20 rounded-[10px] object-cover ring-1 ring-white/20"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-editorial text-[16px] leading-snug">
                      {l.merchandise.product.title}
                    </p>
                    {l.merchandise.title !== 'Default Title' && (
                      <p className="mt-0.5 font-suisse text-[12px] text-white/55">
                        {l.merchandise.title}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex items-center border border-white/25">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setQty(l.id, Math.max(0, l.quantity - 1))}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1 disabled:opacity-40"
                        >
                          &minus;
                        </button>
                        <span className="min-w-6 text-center font-suisse text-[13px]">
                          {l.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setQty(l.id, l.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => remove(l.id)}
                        className="font-suisse text-[12px] text-white/50 underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-suisse text-[14px]">{formatPrice(l.cost.totalAmount)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && cart && (
          <footer className="border-t border-white/12 px-5 py-4">
            <div className="mb-2 flex justify-between font-suisse text-[14px]">
              <span className="text-white/65">Subtotal</span>
              <span>{formatPrice(cart.cost.subtotalAmount)}</span>
            </div>
            <p className="mb-3 font-suisse text-[11.5px] text-white/45">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              onClick={checkout}
              disabled={busy}
              style={{ backgroundColor: '#edc6a2', color: '#3A0D08' }}
              className="w-full py-3.5 font-suisse text-[13px] font-medium uppercase tracking-wider transition-colors hover:bg-white disabled:opacity-50"
            >
              {busy ? 'Updating…' : 'Checkout'}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
