'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { asset } from '@/lib/asset';
import { useCart } from './cart/CartProvider';
import { firstVariant, formatPrice } from '@/lib/shopify';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Product = {
  id: string;
  name: string;
  type: string;
  leftTitle: string;
  leftSub: string;
  rightTitle: string;
  rightSub: string;
  desc: string;
  mobileDesc: string;
  specs: string;
  ingredients: string;
  image: string;
  thumb: string;
  href: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'origin',
    name: 'Origin',
    type: '4-in-1 Milk Emulsion',
    leftTitle: 'Four steps',
    leftSub: 'Serum, moisturiser, primer, SPF',
    rightTitle: 'done in one',
    rightSub: 'lightweight milky step.',
    desc: 'Best for all weathers, all cities.\nNo matter where you are or what\nthe day looks like.',
    mobileDesc: 'Best for all weathers and cities.',
    specs: 'SPF 50+ · PA++++',
    ingredients: 'Formulated with Beta-Glucan and\nCamellia Sinensis Extract',
    image: asset('/products/origin-square.webp'),
    thumb: asset('/products/origin-square.webp'),
    href: '/origin',
  },
  {
    id: 'aura',
    name: 'Aura',
    type: 'Pearl Skinwear™',
    leftTitle: 'Pearls that\nmelt into',
    leftSub: '',
    rightTitle: 'sun\nprotection',
    rightSub: '',
    desc: 'Best for: When you need something\nto adjust to changing weathers, or\nwhen your day is moody.',
    mobileDesc: 'Best for: When you need something\nto adjust to changing weathers, or\nwhen your day is moody.',
    specs: 'SPF 40 · PA++++',
    ingredients: 'Formulated with Ectoin and Bisabolol',
    image: asset('/products/aura-square.webp'),
    thumb: asset('/products/aura-square.webp'),
    href: '/aura',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Where each product's still sits.
 *
 * Two clocks drive this, not one:
 *
 *   `approach` (0 → 1)  the section rising into view, before it pins.
 *                       Origin uses this for its entrance, so by the time the
 *                       section locks to the screen the bottle is already
 *                       centred. Driving the entrance off the PIN instead left
 *                       the stage empty for a whole screen-height of scrolling,
 *                       with the background's centre seam on show.
 *
 *   `pinned`   (0 → 1)  the pinned scroll. Origin holds centre through the
 *                       first half and leaves to the left at the midpoint;
 *                       Aura arrives from the right at that same midpoint, so
 *                       the swap stays exactly where it was on the old 3D
 *                       version and reads as one continuous rightward motion.
 *
 * `x` is a fraction of the card's own width (1 = fully off-frame right,
 * -1 = fully off-frame left); `o` is opacity.
 */
const SLIDE_IN = 0.18;   // pinned-progress units Aura's entrance takes
const SLIDE_OUT = 0.14;  // pinned-progress units Origin's exit takes
const SWAP = 0.5;        // where the product changes over

// Cubic ease-out — fast off the mark, glides into place.
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);

function slideFor(i: number, pinned: number, approach: number) {
  if (i === 0) {
    // Still on the way in — the card tracks the section's approach.
    if (pinned <= 0.0005) {
      const k = easeOut(clamp01(approach));
      return { x: 1 - k, o: clamp01(k * 1.4) };
    }
    if (pinned < SWAP) return { x: 0, o: 1 };
    const k = clamp01((pinned - SWAP) / SLIDE_OUT);
    return { x: -easeOut(k), o: 1 - k };
  }

  // Aura waits off-frame right until the swap point, then slides to centre.
  if (pinned < SWAP) return { x: 1, o: 0 };
  const k = easeOut(clamp01((pinned - SWAP) / SLIDE_IN));
  return { x: 1 - k, o: clamp01(k * 1.6) };
}

export default function ProductShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revolveRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);   // raw pinned progress, written by ScrollTrigger
  const approach = useRef(0);   // 0→1 as the section rises into view
  const eased = useRef(0);      // smoothed pinned value actually painted
  const easedApproach = useRef(0);
  const [active, setActive] = useState(0);
  const { add, products: shopProducts, busy, configured } = useCart();
  const product = PRODUCTS[active];
  const shopProduct = active === 0 ? shopProducts.origin : shopProducts.aura;
  const variant = firstVariant(shopProduct);

  useEffect(() => {
    // Clock 1 — the approach. Spans the section travelling from the bottom of
    // the viewport up to the top, i.e. everything before the pin engages.
    const entry = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => {
        approach.current = self.progress;
      },
    });

    // Clock 2 — the pinned scroll.
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=120%',
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Scroll position is fed through a ref, never state: a setState here
        // would re-render the whole section on every scroll frame.
        progress.current = self.progress;
        setActive(self.progress < 0.5 ? 0 : 1);
      },
    });

    // ── Render loop ──────────────────────────────────────────────────────
    // The slide is painted here rather than straight from onUpdate so the
    // motion survives a spiky scroll source. Raw wheel/touch deltas arrive in
    // clumps; easing toward them each frame turns those clumps into one
    // continuous glide, and writing plain transform strings keeps both cards
    // on their own compositor layers for the whole travel.
    let rafId = 0;
    let painted = -1;
    const tick = () => {
      eased.current += (progress.current - eased.current) * 0.12;
      if (Math.abs(progress.current - eased.current) < 0.0002) {
        eased.current = progress.current;
      }
      easedApproach.current += (approach.current - easedApproach.current) * 0.14;
      if (Math.abs(approach.current - easedApproach.current) < 0.0002) {
        easedApproach.current = approach.current;
      }
      const t = eased.current;
      const a = easedApproach.current;

      const key = t * 1000 + a;
      if (key === painted) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      painted = key;

      for (let i = 0; i < PRODUCTS.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const { x, o } = slideFor(i, t, a);
        el.style.transform = `translate3d(${(x * 100).toFixed(3)}%, 0, 0)`;
        el.style.opacity = o.toFixed(3);
        // Off-frame cards must not swallow taps meant for the copy beneath.
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      }

      if (revolveRef.current) {
        revolveRef.current.style.transform =
          `rotate(${(t * 210).toFixed(2)}deg) scale(1.9)`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      entry.kill();
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100lvh] min-h-[640px] overflow-hidden z-[110] flex items-center justify-center text-[var(--brand-cream,#f5f0eb)] px-3 sm:px-5 lg:px-6 py-6 lg:py-16"
      style={{
        background:
          'var(--bg-eclipse)',
      }}
    >
      {/* ── Revolving gradient. Rotated by scroll in the ScrollTrigger above, so
          the whole field appears to turn with the bottle. Kept at partial opacity
          and oversized (scale 1.9) so its edges never enter frame while turning. ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          ref={revolveRef}
          className="absolute inset-0 opacity-[0.38] will-change-transform"
          style={{
            transform: 'rotate(0deg) scale(1.9)',
            background:
              'conic-gradient(from 0deg at 50% 50%, #FF2A17 0deg, #4D0007 78deg, #A4000F 150deg, #220003 232deg, #A4000F 310deg, #FF2A17 360deg)',
          }}
        />
        {/* Softens the conic's hard colour seams into the page gradient. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 25%, rgba(255,42,23,0.24) 0%, rgba(34,0,3,0.60) 68%, rgba(9,5,6,0.85) 100%)',
          }}
        />
      </div>
      {/* Horizontal Dividing Line: Darker & clearer visible white line */}
      <div className="block lg:hidden absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1.2px] bg-white/45 z-0 pointer-events-none" />

      {/* Desktop Vertical Dividing Line */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/15 z-0 pointer-events-none" />

      {/* ── PRODUCT STILL ──────────────────────────────────────────────────
          Replaces the GLB viewer. Both stills are mounted at once and parked
          off-frame; the rAF loop above drives whichever one the scroll calls
          for from the right edge into the centre.

          Sizing: the card fits the viewport WIDTH with a small breathing gutter
          either side, and stays square. It sits on z-0, behind the copy, exactly
          where the bottle used to — so the headings and buy controls keep
          scrolling over it as before. ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="relative w-[calc(100vw-2.25rem)] max-w-[560px] lg:w-[min(38vw,480px)] aspect-square">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: 'translate3d(100%, 0, 0)',
                opacity: i === 0 ? 1 : 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={`${p.name} — ${p.type}`}
                className="h-full w-full object-contain select-none rounded-[22px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.75)]"
                draggable={false}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 mx-auto h-[92svh] lg:min-h-[85vh] flex flex-col justify-between">

        {/* ── DESKTOP SWITCH CARDS (Hidden on Mobile screens completely) ── */}
        <div className="hidden lg:flex relative z-[120] items-center justify-end gap-3 sm:gap-4 w-full mt-2 sm:mt-4 pointer-events-auto">
          {/* Origin Card */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActive(0);
            }}
            aria-label="Switch to Origin"
            className={`cursor-pointer relative z-[120] flex items-center justify-center h-16 w-16 md:h-[72px] md:w-[72px] rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${active === 0
                ? 'border-white/90 bg-black/50 scale-105 shadow-xl ring-2 ring-white/40'
                : 'border-white/20 bg-black/20 opacity-60 hover:opacity-100 hover:scale-100'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUCTS[0].thumb} alt="Origin" className="h-full w-full object-cover pointer-events-none" />
            {active === 0 && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-glow pointer-events-none" />}
          </button>

          {/* Aura Card */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActive(1);
            }}
            aria-label="Switch to Aura"
            className={`cursor-pointer relative z-[120] flex items-center justify-center h-16 w-16 md:h-[72px] md:w-[72px] rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${active === 1
                ? 'border-white/90 bg-black/50 scale-105 shadow-xl ring-2 ring-white/40'
                : 'border-white/20 bg-black/20 opacity-60 hover:opacity-100 hover:scale-100'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUCTS[1].thumb} alt="Aura" className="h-full w-full object-cover pointer-events-none" />
            {active === 1 && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-glow pointer-events-none" />}
          </button>
        </div>


        {/* ── MOBILE TOP HEADER (Exact Screenshot Match) ── */}
        <div className="lg:hidden w-full flex flex-col items-center text-center pt-4 xs:pt-6 px-4 z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-mobile-top'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full flex flex-col items-center"
            >
              {/* Top Tag Badge */}
              <div className="inline-flex items-center justify-center px-3 py-1 mb-3 bg-[#EAE3D2] text-[#8B1E13] font-suisse text-[12px] tracking-[0.06em] uppercase font-normal rounded-none shadow-sm">
                {product.id === 'origin' ? 'ORIGIN · 4-in-1 Milk Emulsion' : 'AURA · Pearl Skinwear'}
              </div>

              {/* Main Heading & Subtitle */}
              {product.id === 'origin' ? (
                <>
                  <h2 className="font-editorial text-[38px] xs:text-[44px] leading-[1.02] tracking-[-0.01em] text-[var(--brand-cream,#f5f0eb)] drop-shadow-md">
                    4 steps done in 1
                  </h2>
                  <p className="font-suisse text-[14px] xs:text-[15px] leading-[1.35] text-[var(--brand-cream,#f5f0eb)]/90 mt-2 max-w-[320px]">
                    Serum, moisturiser, primer, SPF in one<br />
                    lightweight milky step
                  </p>
                </>
              ) : (
                <h2 className="font-editorial text-[36px] xs:text-[42px] leading-[1.02] tracking-[-0.01em] text-[var(--brand-cream,#f5f0eb)] drop-shadow-md max-w-[340px]">
                  Pearls that melt into<br />
                  sun protection
                </h2>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── DESKTOP MIDDLE ROW (Untouched Left/Right Title Columns) ── */}
        <div className="hidden lg:grid grid-cols-2 gap-8 items-center my-auto w-full">
          {/* Left Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-center-left'}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-start text-left w-full pl-2"
            >
              <h2 className="font-editorial text-[clamp(44px,7.2vw,118px)] leading-[0.88] tracking-[-0.02em] whitespace-pre-line drop-shadow-md">
                {product.leftTitle}
              </h2>
              <p className="font-suisse text-[24px] leading-snug text-white/90 mt-5 tracking-wide">
                {product.leftSub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Right Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-center-right'}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-end text-right w-full pr-2"
            >
              <h2 className="font-editorial text-[clamp(44px,7.2vw,118px)] leading-[0.88] tracking-[-0.02em] whitespace-pre-line drop-shadow-md">
                {product.rightTitle}
              </h2>
              <p className="font-suisse text-[24px] leading-snug text-white/90 mt-5 tracking-wide">
                {product.rightSub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── MOBILE BOTTOM STACK (Exact Screenshot Match) ── */}
        <div className="lg:hidden w-full flex flex-col items-center text-center pb-6 xs:pb-8 px-4 z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-mobile-bottom'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full flex flex-col items-center"
            >
              {/* Row: Add to Bag + Circle Diagonal Arrow */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => variant && add(variant.id, 1)}
                  disabled={!configured || !variant || busy || !variant.availableForSale}
                  className="btn-solid-beige pointer-events-auto bg-[#E8C5A5] text-[#8B1E13] font-editorial text-[17px] font-medium tracking-wide px-7 py-2.5 rounded-none active:scale-95 transition-transform shadow-md"
                >
                  Add to bag
                </button>

                <Link
                  href={product.href}
                  aria-label={`Go to ${product.name}`}
                  className="w-[42px] h-[42px] rounded-full border border-[var(--brand-cream,#f5f0eb)]/80 bg-transparent flex items-center justify-center text-[var(--brand-cream,#f5f0eb)] active:scale-95 transition-transform shadow-md pointer-events-auto"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>
              </div>

              {/* Specs Headline (SPF) */}
              <h3 className="font-editorial text-[24px] xs:text-[27px] leading-tight tracking-tight text-[var(--brand-cream,#f5f0eb)] mb-1">
                {product.specs}
              </h3>

              {/* Formula & Tagline */}
              <div className="font-suisse text-[13px] xs:text-[14px] leading-[1.35] text-[var(--brand-cream,#f5f0eb)]/90 max-w-[330px] space-y-0.5">
                <p>{product.ingredients}</p>
                {product.id === 'origin' ? (
                  <p>Best for all weathers and cities.</p>
                ) : (
                  <p>
                    <span className="font-medium text-white">Best for:</span> When you need something to adjust to changing weathers.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── DESKTOP BOTTOM ROW (Explicit Line Breaks) ── */}
        <div className="hidden lg:grid grid-cols-2 gap-16 items-end w-full pb-10 -translate-y-4">
          {/* Bottom Left: Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-desc'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="max-w-[560px] text-left pl-2"
            >
              {product.id === 'aura' ? (
                <p
                  style={{ color: '#E8C5A5' }}
                  className="font-suisse text-[18px] leading-[1.35] tracking-wide drop-shadow-sm font-normal"
                >
                  Best for: When you need something<br />
                  to adjust to changing weathers, or<br />
                  when your day is moody.
                </p>
              ) : (
                <p
                  style={{ color: '#E8C5A5' }}
                  className="font-suisse text-[18px] leading-[1.35] tracking-wide drop-shadow-sm font-normal"
                >
                  Best for all weathers, all cities.<br />
                  No matter where you are or what<br />
                  the day looks like.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Right: Button + Specs + Formula */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id + '-meta'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-end text-right space-y-1"
            >
              <button
                type="button"
                onClick={() => variant && add(variant.id, 1)}
                disabled={!configured || !variant || busy || !variant.availableForSale}
                style={{ backgroundColor: '#E8C5A5', color: '#3A0D08' }}
                className="btn-solid-beige pointer-events-auto font-suisse text-sm tracking-wider uppercase px-9 py-3 font-medium shadow-lg rounded-none mb-1.5 hover:bg-[#FAF6EE] transition-colors"
              >
                {!configured
                  ? 'Add to bag'
                  : busy
                    ? 'Adding…'
                    : !variant
                      ? 'Unavailable'
                      : !variant.availableForSale
                        ? 'Sold out'
                        : `Add to bag — ${formatPrice(variant.price)}`}
              </button>

              <style jsx>{`
  .btn-solid-beige:disabled {
    opacity: 1 !important;
  }
`}</style>
              <p
                style={{ color: '#edc6a2' }}
                className="font-editorial text-[19px] leading-tight tracking-wider"
              >
                {product.specs}
              </p>
              <p
                style={{ color: '#edc6a2' }}
                className="font-suisse text-[18px] leading-tight tracking-wide whitespace-pre-line"
              >
                {product.ingredients}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
