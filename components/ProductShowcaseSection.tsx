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
    image: asset('/product-shots/origin-square.webp'),
    thumb: asset('/product-shots/origin-square.webp'),
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
    image: asset('/product-shots/aura-square.webp'),
    thumb: asset('/product-shots/aura-square.webp'),
    href: '/aura',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const SLIDE_IN = 0.18;
const SLIDE_OUT = 0.14;
const SWAP = 0.5;

const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);

function slideFor(i: number, pinned: number, approach: number) {
  if (i === 0) {
    if (pinned <= 0.0005) {
      const k = easeOut(clamp01(approach));
      return { x: 1 - k, o: clamp01(k * 1.4) };
    }
    if (pinned < SWAP) return { x: 0, o: 1 };
    const k = clamp01((pinned - SWAP) / SLIDE_OUT);
    return { x: -easeOut(k), o: 1 - k };
  }

  if (pinned < SWAP) return { x: 1, o: 0 };
  const k = easeOut(clamp01((pinned - SWAP) / SLIDE_IN));
  return { x: 1 - k, o: clamp01(k * 1.6) };
}

export default function ProductShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revolveRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const approach = useRef(0);
  const eased = useRef(0);
  const easedApproach = useRef(0);
  const [active, setActive] = useState(0);
  const { add, products: shopProducts, busy, configured } = useCart();
  const product = PRODUCTS[active];
  const shopProduct = active === 0 ? shopProducts.origin : shopProducts.aura;
  const variant = firstVariant(shopProduct);

  // Switch products and animate center image on click
  const handleProductSwitch = (targetIndex: number) => {
    setActive(targetIndex);
    progress.current = targetIndex === 0 ? 0.2 : 0.8;
  };

  useEffect(() => {
    const entry = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => {
        approach.current = self.progress;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=120%',
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        progress.current = self.progress;

        const nextProduct = self.progress < 0.5 ? 0 : 1;

        setActive((current) => {
          return current === nextProduct ? current : nextProduct;
        });
      },
    });

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
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      }

      if (revolveRef.current) {
        revolveRef.current.style.transform = 'scale(2.5)';
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
      className="relative w-full h-[100lvh] min-h-[640px] overflow-hidden z-[110] flex items-center justify-center text-[#E8DCC8] px-3 sm:px-5 lg:px-6 py-6 lg:py-16"
      style={{
        background: 'var(--bg-eclipse)',
      }}
    >
      {/* Background Gradient with oversized scale to eliminate visible rotation edge */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          ref={revolveRef}
          className="absolute inset-0 opacity-[0.85] will-change-transform"
          style={{
            transform: 'scale(2.5)',
            background:
              'radial-gradient(circle at 50% 76%, #FF2A17 0%, #A4000F 13%, #4D0007 30%, #220003 47%, #120205 66%, #0A0306 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 25%, rgba(255,42,23,0.24) 0%, rgba(34,0,3,0.60) 68%, rgba(9,5,6,0.85) 100%)',
          }}
        />
      </div>

      {/* Horizontal Dividing Line (Mobile) */}
      <div className="block lg:hidden absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1.2px] bg-white/45 z-0 pointer-events-none" />

      {/* Vertical Dividing Line (Desktop) */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/15 z-0 pointer-events-none" />

      {/* Center Image Container */}
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
              {/* The image links to its product page. Only the product on screen
                  is clickable — the two cards are stacked, so the hidden one
                  must not catch the tap. */}
              <Link
                href={p.href}
                aria-label={`View ${p.name}`}
                tabIndex={active === i ? 0 : -1}
                className={`block h-full w-full rounded-[22px] ${active === i ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  width={1080}
                  height={1080}
                  alt={`${p.name} — ${p.type}`}
                  className="h-full w-full object-contain select-none rounded-[22px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.75)]"
                  draggable={false}
                  loading="eager"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 mx-auto h-[92svh] lg:min-h-[85vh] flex flex-col justify-between pointer-events-none">

        {/* ── DESKTOP SWITCH CARDS ── */}
        <div className="hidden lg:flex relative z-[120] items-center justify-end gap-3 sm:gap-4 w-full mt-2 sm:mt-4 pointer-events-auto">
          {/* Origin Card */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProductSwitch(0);
            }}
            aria-label="Switch to Origin"
            className={`cursor-pointer relative z-[120] flex items-center justify-center h-16 w-16 md:h-[72px] md:w-[72px] rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${active === 0
              ? 'border-[#E8DCC8] bg-black/50 scale-105 shadow-xl ring-2 ring-[#E8DCC8]/40'
              : 'border-white/20 bg-black/20 opacity-60 hover:opacity-100 hover:scale-100'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUCTS[0].thumb} width={1080} height={1080} alt="Origin" className="h-full w-full object-cover pointer-events-none" />
            {active === 0 && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E8DCC8] shadow-glow pointer-events-none" />}
          </button>

          {/* Aura Card */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProductSwitch(1);
            }}
            aria-label="Switch to Aura"
            className={`cursor-pointer relative z-[120] flex items-center justify-center h-16 w-16 md:h-[72px] md:w-[72px] rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${active === 1
              ? 'border-[#E8DCC8] bg-black/50 scale-105 shadow-xl ring-2 ring-[#E8DCC8]/40'
              : 'border-white/20 bg-black/20 opacity-60 hover:opacity-100 hover:scale-100'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PRODUCTS[1].thumb} width={1080} height={1080} alt="Aura" className="h-full w-full object-cover pointer-events-none" />
            {active === 1 && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E8DCC8] shadow-glow pointer-events-none" />}
          </button>
        </div>

        {/* ── MOBILE TOP HEADER ── */}
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
              {/* Product Badge: Unified Beige Color with Red Brand Text */}
              <div className="inline-flex items-center justify-center px-3 py-1 mb-3 bg-[#E8DCC8] text-[#A52A2C] font-suisse text-[12px] tracking-[0.06em] uppercase  rounded-none shadow-sm">
                {product.id === 'origin' ? 'ORIGIN · 4-in-1 Milk Emulsion' : 'AURA · Pearl Skinwear'}
              </div>

              {/* Headings */}
              {product.id === 'origin' ? (
                <>
                  <h2 className="font-editorial text-[38px] xs:text-[44px] leading-[1.02] tracking-[-0.01em] text-[#E8DCC8] drop-shadow-md">
                    4 steps done in 1
                  </h2>
                  <p className="font-suisse text-[14px] xs:text-[15px] leading-[1.35] text-[#E8DCC8]/90 mt-2 max-w-[320px]">
                    Serum, moisturiser, primer, SPF in one<br />
                    lightweight milky step
                  </p>
                </>
              ) : (
                <h2 className="font-editorial text-[36px] xs:text-[42px] leading-[1.02] tracking-[-0.01em] text-[#E8DCC8] drop-shadow-md max-w-[340px]">
                  Pearls that melt into<br />
                  sun protection
                </h2>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── DESKTOP MIDDLE ROW ── */}
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
              <h2 className="font-editorial text-[clamp(44px,7.2vw,118px)] leading-[0.88] tracking-[-0.02em] whitespace-pre-line drop-shadow-md text-[#E8DCC8]">
                {product.leftTitle}
              </h2>
              <p className="font-suisse text-[24px] leading-snug text-[#E8DCC8]/90 mt-5 tracking-wide">
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
              <h2 className="font-editorial text-[clamp(44px,7.2vw,118px)] leading-[0.88] tracking-[-0.02em] whitespace-pre-line drop-shadow-md text-[#E8DCC8]">
                {product.rightTitle}
              </h2>
              <p className="font-suisse text-[24px] leading-snug text-[#E8DCC8]/90 mt-5 tracking-wide">
                {product.rightSub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── MOBILE BOTTOM STACK ── */}
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
              {/* Row: ADD TO BAG centered independently, Arrow docked immediately to the right */}
              <div className="relative w-full flex items-center justify-center mb-4">
                {/* 1. Main ADD TO BAG Button — dead-centered horizontally */}
                <button
                  type="button"
                  onClick={() => variant && add(variant.id, 1)}
                  disabled={!configured || !variant || busy || !variant.availableForSale}
                  className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 md:px-7 py-2 md:py-2.5 bg-[#E8DCC8] text-[#3A0D08] hover:bg-white transition-colors font-medium rounded-sm"
                >
                  ADD TO BAG
                </button>

                {/* 2. Smaller Arrow Circle — docked to the right edge of ADD TO BAG */}
                <div className="absolute left-1/2 ml-[72px] sm:ml-[80px]">
                  <Link
                    href={product.href}
                    aria-label={`Go to ${product.name}`}
                    className="w-[32px] h-[32px] rounded-full border border-[#E8DCC8] bg-transparent flex items-center justify-center text-[#E8DCC8] active:scale-95 transition-transform shadow-md pointer-events-auto"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Specs Headline */}
              <h3 className="font-editorial text-[24px] xs:text-[27px] leading-tight tracking-tight text-[#E8DCC8] mb-1">
                {product.specs}
              </h3>

              {/* Formula & Tagline with clean 2nd line break */}
              <div className="font-suisse text-[13px] xs:text-[14px] leading-[1.35] text-[#E8DCC8]/90 max-w-[330px] space-y-0.5 whitespace-pre-line">
                <p>{product.ingredients}</p>
                {product.id === 'origin' ? (
                  <p>
                    <span className="font-medium text-[#E8DCC8]">Best for:</span> All weather and cities.
                  </p>
                ) : (
                  <p>
                    <span className="font-medium text-[#E8DCC8]">Best for:</span> When you need something to adjust to changing weathers.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── DESKTOP BOTTOM ROW ── */}
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
                  style={{ color: '#E8DCC8' }}
                  className="font-suisse text-[18px] leading-[1.35] tracking-wide drop-shadow-sm font-normal"
                >
                  Best for: When you need something<br />
                  to adjust to changing weathers, or<br />
                  when your day is moody.
                </p>
              ) : (
                <p
                  style={{ color: '#E8DCC8' }}
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
                style={{ backgroundColor: '#E8DCC8', color: '#3A0D08' }}
                className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 md:px-7 py-2 md:py-2.5 bg-[#E8DCC8] text-[#3A0D08] hover:bg-white transition-colors font-medium rounded-sm mb-1.5 lg:mb-2"
              >
                {!configured
                  ? 'ADD TO BAG'
                  : busy
                    ? 'ADDING…'
                    : !variant
                      ? 'UNAVAILABLE'
                      : !variant.availableForSale
                        ? 'SOLD OUT'
                        : `ADD TO BAG — ${formatPrice(variant.price)}`}
              </button>

              <style jsx>{`
                .btn-solid-beige:disabled {
                  opacity: 1 !important;
                }
              `}</style>
              <p
                style={{ color: '#E8DCC8' }}
                className="font-editorial text-[19px] leading-tight tracking-wider"
              >
                {product.specs}
              </p>
              <p
                style={{ color: '#E8DCC8' }}
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