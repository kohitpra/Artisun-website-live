'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  addLine,
  createCart,
  getCart,
  getCatalogue,
  removeLine,
  shopifyConfigured,
  updateLine,
  type Cart,
  type Catalogue,
} from '@/lib/shopify';

const KEY = 'artisun_cart_id';

type Ctx = {
  cart: Cart | null;
  products: Catalogue;
  loadingProducts: boolean;
  configured: boolean;
  error: string | null;
  busy: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (variantId: string, qty?: number) => Promise<void>;
  setQty: (lineId: string, qty: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  checkout: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Catalogue>({ origin: null, aura: null });
  const [loadingProducts, setLoadingProducts] = useState(shopifyConfigured);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch the catalogue once for the whole app.
  useEffect(() => {
    if (!shopifyConfigured) return;
    getCatalogue()
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Rehydrate the cart. Shopify expires carts after ~10 days idle and then
  // returns null for the id — drop the stale id instead of wedging the cart.
  useEffect(() => {
    if (!shopifyConfigured) return;
    const id = localStorage.getItem(KEY);
    if (!id) return;
    getCart(id)
      .then((c) => (c ? setCart(c) : localStorage.removeItem(KEY)))
      .catch(() => localStorage.removeItem(KEY));
  }, []);

  const add = useCallback(
    async (variantId: string, qty = 1) => {
      setBusy(true);
      setError(null);
      try {
        let next: Cart;
        if (cart?.id) {
          next = await addLine(cart.id, variantId, qty);
        } else {
          next = await createCart(variantId, qty);
          localStorage.setItem(KEY, next.id);
        }
        setCart(next);
        setOpen(true);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [cart?.id],
  );

  const setQty = useCallback(
    async (lineId: string, qty: number) => {
      if (!cart?.id) return;
      setBusy(true);
      try {
        setCart(await updateLine(cart.id, lineId, qty));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [cart?.id],
  );

  const remove = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;
      setBusy(true);
      try {
        setCart(await removeLine(cart.id, lineId));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [cart?.id],
  );

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  }, [cart?.checkoutUrl]);

  return (
    <CartCtx.Provider
      value={{
        cart,
        products,
        loadingProducts,
        configured: shopifyConfigured,
        error,
        busy,
        open,
        setOpen,
        add,
        setQty,
        remove,
        checkout,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart must be used inside <CartProvider>');
  return c;
};
