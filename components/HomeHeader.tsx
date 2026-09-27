'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';
import { useCart } from './cart/CartProvider';

import SizedImg from '@/components/media/SizedImg';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Shared button shape — single source of truth for every nav "pill" button
 * (text or icon) so they're all the same size/shape/color, here and anywhere
 * else this pattern is reused on the site.
 *
 * Box: #E6D5C1, hover → #A52A2C
 * Text/icon: #A52A2C, hover → #E6D5C1
 *
 * `h-[36px] px-4 py-1.5` and `items-center justify-center` are now identical
 * across every variant — previously the icon buttons (Origin/Aura) used
 * `px-3.5` and `items-end` while the text buttons used `px-4` and
 * `items-center`, which is why they didn't line up as the same shape.
 */
const NAV_PILL =
  'group bg-[#E6D5C1] hover:bg-[#A52A2C] flex items-center justify-center h-[36px] px-4 py-1.5 transition-all duration-200';
const NAV_PILL_TEXT =
  'text-[#A52A2C] hover:text-[#E6D5C1] group-hover:text-[#E6D5C1] font-editorial text-[17px] tracking-tight whitespace-nowrap';

/**
 * Product icon color-swap on hover.
 *
 * The Origin/Aura icons are raster PNGs, not currentColor SVGs — text-color
 * classes (like NAV_PILL_TEXT uses) can't touch their pixels. Instead this
 * runs a CSS filter chain: `brightness(0)` first crushes every opaque pixel
 * to solid black regardless of the PNG's original color, then the
 * invert/sepia/saturate/hue-rotate/brightness/contrast chain tints that
 * black to #E6D5C1 — the same technique already used on the hamburger menu
 * icon below, just re-tuned for this color. Because it starts from a
 * neutral black every time, it works no matter what color the source PNG
 * currently is.
 *
 * Rest state has no filter, so the icon shows its native/original color.
 * Hover applies the filter so it inverts to cream against the darkened
 * #A52A2C box — matching how the text pills invert.
 *
 * NOTE: the exact filter values below are tuned to land on #E6D5C1 for a
 * PNG whose opaque shape is otherwise uncolored/dark. If your Origin/Aura
 * PNGs have strong color of their own (not just a dark silhouette), the
 * brightness(0) step still neutralizes that, but check the hover result
 * against your actual assets and nudge the hue-rotate/sepia values with a
 * filter-generator tool (e.g. isotropic.co/tools/hex-color-to-css-filter)
 * if it's off.
 */
const PRODUCT_ICON_HOVER =
  'transition-[filter] duration-200 group-hover:[filter:brightness(0)_saturate(100%)_invert(85%)_sepia(20%)_saturate(378%)_hue-rotate(342deg)_brightness(101%)_contrast(94%)]';

export default function HomeHeader({ ready = false }: { ready?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setOpen: setCartOpen, cart } = useCart();
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuLogoRef = useRef<HTMLButtonElement>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);

  /* ── Wordmark → header morph ───────────────────────────────────────────
     Previously this ran through a scrubbed ScrollTrigger that re-measured on
     every refresh. On mobile that is the source of the shake: the browser
     resizes the viewport as the address bar collapses mid-scroll, which fires
     a refresh, which re-measures against a different innerHeight — so the
     travel distance (and therefore the wordmark's position) changes underfoot,
     several times per gesture.

     The morph now runs on its own rAF loop instead:
       • geometry is measured ONCE and only re-measured when the viewport WIDTH
         changes, so address-bar height wobble can never move the target;
       • the travel length is frozen at first measure for the same reason;
       • raw scroll is eased toward with a light lerp, so a spiky scroll
         position maps to a continuous transform;
       • the transform is written as one translate3d + scale string, keeping
         the element on its own compositor layer for the whole flight.

     Mobile wobble fix (v2): ANY trailing filter on mobile — even the
     time-normalized exponential follow tried before — makes the wordmark
     move out of phase with the page. Touch scrolling is already smooth
     (native momentum, or Lenis when it drives the scroll), so smoothing it
     again means the logo lags the content and then catches up: that
     rubber-banding is the wobble. On mobile the morph is now a PURE
     function of scrollY — zero smoothing, locked 1:1 to the page — and the
     translate is snapped to physical device pixels so the scaled bitmap
     can't shimmer on sub-pixel positions. Desktop keeps its light lerp,
     where mouse-wheel steps genuinely need it.
     ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const img = wordmarkRef.current;
    const nav = navRef.current;
    if (!img) return;

    const geo = { tx: 0, ty: 0, scale: 1 };
    let travel = 1;          // px of scroll the morph is spread across
    let lastWidth = 0;
    let smoothed = 0;        // eased progress actually painted
    let rafId = 0;
    let navOpacity = -1;     // cached so we only touch the DOM on change
    let lastPainted = -1;    // last progress written to the DOM
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isMobileOrTablet = window.innerWidth < 1024;

    /* ── Mobile & Tablet wobble fix (v3): CSS scroll-driven animation. ──
       Even a pure 1:1 rAF mapping of scrollY can't be wobble-free on iOS/touch:
       the page scrolls on the compositor thread while JS only sees scroll
       positions a beat later, so a JS-written transform is always slightly
       out of phase with the content moving underneath it — that phase error
       IS the wobble. Safari 26 / Chrome 115+ support scroll timelines
       (`animation-timeline: scroll()`), which run the very same transform
       on the compositor, locked to the scroll with no JS in the loop.
       Geometry is still measured here and handed over via CSS custom
       properties; browsers without support keep the rAF path unchanged. */
    const useCssTimeline =
      isMobileOrTablet &&
      typeof CSS !== 'undefined' &&
      CSS.supports('animation-timeline: scroll()');

    img.style.transformOrigin = 'left top';
    img.style.willChange = 'transform';

    const measure = () => {
      // Read the resting box with the transform neutralised, then restore it in
      // the same frame so nothing is ever painted mid-measure. On the CSS
      // timeline path the animated transform would win over the inline
      // 'none', so the class is stripped for the measurement instead.
      if (useCssTimeline) img.classList.remove('wm-scroll-anim');
      img.style.transform = 'none';
      const r = img.getBoundingClientRect();

      const isDesktop = window.innerWidth >= 1024;
      const isTab = window.innerWidth >= 768 && window.innerWidth < 1024;
      const padY = isDesktop ? 24 : isTab ? 14 : 16;
      const padX = isDesktop ? 40 : isTab ? 32 : 16;
      const compactW = isDesktop ? 140 : isTab ? 115 : 100;

      geo.scale = r.width > 0 ? compactW / r.width : 1;
      geo.tx = padX - r.left;
      geo.ty = padY - r.top;

      // Mobile/tablet: the wordmark now rests at the TOP of the hero, so it has
      // a short way to go — dock it over the first ~55% of a screen instead of
      // 85%, otherwise it lingers big over the product. Desktop unchanged.
      travel = Math.max(1, window.innerHeight * (isMobileOrTablet ? 0.55 : 0.85));
      lastWidth = window.innerWidth;

      if (useCssTimeline) {
        img.style.transform = '';
        img.style.setProperty('--wm-tx', `${geo.tx}px`);
        img.style.setProperty('--wm-ty', `${geo.ty}px`);
        img.style.setProperty('--wm-scale', String(geo.scale));
        img.style.setProperty('--wm-travel', `${travel}px`);
        img.classList.add('wm-scroll-anim');
        return;
      }

      paint(smoothed);
    };

    const paint = (p: number) => {
      lastPainted = p;

      // On the CSS timeline path the compositor owns the transform — JS only
      // keeps driving the header bar fade below.
      if (!useCssTimeline) {
        const s = 1 + (geo.scale - 1) * p;
        // Snap the translate to PHYSICAL pixels: a large bitmap being scaled
        // while sitting on fractional positions shimmers on mobile GPUs.
        const dpr = window.devicePixelRatio || 1;
        const x = Math.round(geo.tx * p * dpr) / dpr;
        const y = Math.round(geo.ty * p * dpr) / dpr;
        img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      }

      // Header bar + controls fade in over the back half of the flight.
      const o = p < 0.5 ? 0 : Math.min(1, (p - 0.5) / 0.4);
      if (nav && Math.abs(o - navOpacity) > 0.001) {
        navOpacity = o;
        nav.style.opacity = String(o);
        nav.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      }
    };

    const tick = () => {
      const target = Math.min(1, Math.max(0, window.scrollY / travel));

      if (isMobileOrTablet) {
        // Locked 1:1 to the page — the scroll source is already smooth on
        // touch, so any easing here only phases the logo against the content.
        smoothed = target;
      } else {
        // Original per-frame follow, unchanged for desktop.
        smoothed += (target - smoothed) * 0.18;
        if (Math.abs(target - smoothed) < 0.0004) smoothed = target;
      }

      if (smoothed !== lastPainted) paint(smoothed);
      rafId = requestAnimationFrame(tick);
    };

    // Only a WIDTH change is a real layout change worth re-measuring for.
    // Height-only changes are the address bar, and must be ignored.
    const onResize = () => {
      if (window.innerWidth !== lastWidth) measure();
    };

    const start = () => {
      measure();
      smoothed = Math.min(1, Math.max(0, window.scrollY / travel));
      paint(smoothed);
    };

    if (img.complete) start();
    else img.addEventListener('load', start, { once: true });

    rafId = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', measure);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', measure);
      img.removeEventListener('load', start);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    gsap.to(headerRef.current, { opacity: 1, duration: 1.0, ease: 'power2.out' });
  }, [ready]);

  /* ── Mobile/tablet wordmark entrance ──
     Once the loader finishes, the big wordmark is revealed top-down with a
     clip-path wipe. clip-path (not a transform) is used on purpose: it never
     changes the element's measured box, so the scroll morph's geometry
     (measured from getBoundingClientRect) stays exact. Desktop untouched. */
  useEffect(() => {
    const wrap = wordmarkWrapRef.current;
    if (!wrap || window.innerWidth >= 1024) return;
    if (!ready) {
      gsap.set(wrap, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
      return;
    }
    gsap.fromTo(
      wrap,
      { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.3,
        delay: 0.25,
        ease: 'power3.out',
        clearProps: 'clipPath',
      },
    );
  }, [ready]);

  const scrollToHero = () => {
    const lenis = (window as any).lenis; // if you're using a Lenis instance
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('artisun:mobile-menu', { detail: mobileMenuOpen }));
  }, [mobileMenuOpen]);
  return (
    <>

      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
      >
        {/* Scroll-Revealed Container (Header Gradient Bar + Buttons) */}
        <div
          ref={navRef}
          className="w-full flex items-center justify-between px-4 md:px-8 lg:px-10 py-2.5 md:py-3.5 lg:py-6 opacity-0 transition-opacity pointer-events-none bg-gradient-to-r from-[#D9381E]/95 via-[#9E1B0E]/95 to-[#500A06]/95 backdrop-blur-md lg:[background:none] lg:backdrop-blur-none border-b border-[#E8DAC7]/15 lg:border-b-0 shadow-[0_4px_20px_rgba(0,0,0,0.25)] lg:shadow-none"
        >
          {/* Left: Spacer placeholder for docked wordmark */}
          <div className="flex items-center pointer-events-none">
            <span className="w-[100px] md:w-[120px] lg:w-[145px] h-[36px]" aria-hidden />
          </div>

          {/* Desktop Right Corner: Beige Modular Tabs Box.
              Every pill below shares NAV_PILL for the box (same height,
              padding, alignment) — only the inner content differs. Text
              pills add NAV_PILL_TEXT for color/typography; icon pills keep
              the same box but render an image instead. */}
          <div className="hidden lg:flex items-center gap-[4px] pointer-events-auto">
            {/* 1. Shop All */}
            <Link
              href="/all-products"
              className={`${NAV_PILL} ${NAV_PILL_TEXT}`}
            >
              <span className="text-[#A52A2C] group-hover:text-[#E6D5C1] transition-colors duration-200">
                Shop All
              </span>
            </Link>

            {/* 2. Origin Bottle Box */}
            <Link
              href="/origin"
              aria-label="Origin SPF 50+"
              className={NAV_PILL}
            >
              <span
                aria-hidden="true"
                className="w-[13px] h-[25px] bg-[#A52A2C] group-hover:bg-[#E6D5C1] transition-colors duration-200 block shrink-0"
                style={{
                  maskImage: `url(${asset('/origin.png')})`,
                  WebkitMaskImage: `url(${asset('/origin.png')})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </Link>

            {/* 3. Aura Jar Box */}
            <Link
              href="/aura"
              aria-label="Aura SPF 40"
              className={NAV_PILL}
            >
              <span
                aria-hidden="true"
                className="w-[22px] h-[16px] translate-y-[4.5px] bg-[#A52A2C] group-hover:bg-[#E6D5C1] transition-colors duration-200 block shrink-0"
                style={{
                  maskImage: `url(${asset('/aura.png')})`,
                  WebkitMaskImage: `url(${asset('/aura.png')})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </Link>

            {/* 4. Climate-smart */}
            <Link
              href="/climate"
              className={`${NAV_PILL} ${NAV_PILL_TEXT}`}
            >
              <span className="text-[#A52A2C] group-hover:text-[#E6D5C1] transition-colors duration-200">
                Climate-smart
              </span>
            </Link>

            {/* 5. Skinwear™ */}
            <Link
              href="/skinwear"
              className={`${NAV_PILL} ${NAV_PILL_TEXT}`}
            >
              <span className="text-[#A52A2C] group-hover:text-[#E6D5C1] transition-colors duration-200">
                Skinwear™
              </span>
            </Link>

            {/* 6. About */}
            <Link
              href="/about"
              className={`${NAV_PILL} ${NAV_PILL_TEXT}`}
            >
              <span className="text-[#A52A2C] group-hover:text-[#E6D5C1] transition-colors duration-200">
                About
              </span>
            </Link>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${cart?.totalQuantity ? `, ${cart.totalQuantity} items` : ''}`}
              className={`${NAV_PILL} relative cursor-pointer`}
            >
              <svg className="w-5 h-5 text-[#A52A2C] group-hover:text-[#E6D5C1] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1.5"></circle>
                <circle cx="20" cy="21" r="1.5"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {!!cart?.totalQuantity && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#A52A2C] text-[#E6D5C1] text-[10px] font-suisse font-medium grid place-items-center">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>

          {/* Mobile & Tablet Right Controls: Bag (Left) + RR Logo (Right) */}
          <div className="lg:hidden flex items-center gap-3.5 md:gap-5 pointer-events-auto">
            {/* Bag Icon */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${cart?.totalQuantity ? `, ${cart.totalQuantity} items` : ''}`}
              className="relative text-[var(--brand-cream,#E8DAC7)] hover:opacity-75 transition-opacity p-1 cursor-pointer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1.5"></circle>
                <circle cx="20" cy="21" r="1.5"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {!!cart?.totalQuantity && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#E6D5C1] text-[#A52A2C] text-[9px] font-suisse font-bold grid place-items-center">
                  {cart.totalQuantity}
                </span>
              )}
            </button>

            {/* RR Monogram Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="flex items-center justify-center p-1 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <SizedImg
                src={asset('/logo-artisun.svg')} width={964} height={800}
                alt="Menu"
                className="h-6 w-auto object-contain [filter:brightness(0)_saturate(100%)_invert(87%)_sepia(11%)_saturate(671%)_hue-rotate(345deg)_brightness(97%)_contrast(90%)]"
              />
            </button>
          </div>
        </div>

        {/* Flying Animated Wordmark.
            Mobile/tablet: the wordmark rests at the TOP of the first screen,
            full width over the product shot (per the client's reference), and
            shrinks into the header as the page scrolls.
            Desktop keeps its original top-anchored spot. */}
        <div
          ref={wordmarkWrapRef}
          className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-center pt-[4.5svh] lg:pt-[8vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <SizedImg
            ref={wordmarkRef}
            src={asset('/Artisun Primary Logo.webp')} width={1800} height={411}
            alt="ARTISUN"
            onClick={scrollToHero}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToHero();
              }
            }}
            className="pointer-events-auto w-[min(92vw,1300px)] lg:w-[min(90vw,1300px)] h-auto select-none drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] cursor-pointer"
            draggable={false}
          />
        </div>
      </header>

      {/* Mobile & Tablet Drawer (Right to Left Slide) */}
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 z-[120] lg:hidden transition-transform duration-500 ease-out flex flex-col justify-between p-7 md:p-12 md:py-14 md:px-16 overflow-hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Red Eclipse Site-wide Background */}
        <div className="artisun-bg pointer-events-none" />
        <div className="flex items-center justify-between w-full max-w-lg md:max-w-2xl mx-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Go to home"
            className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center cursor-pointer hover:opacity-100 transition-opacity"
          >
            <span
              aria-hidden="true"
              className="block w-full h-full bg-[#E6D5C1]"
              style={{
                maskImage: `url(${asset('/logo-artisun.svg')})`,
                WebkitMaskImage: `url(${asset('/logo-artisun.svg')})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-[#E8DCC8] hover:bg-white/20 transition-colors"
          >
            <svg width="18" height="18" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col my-auto border-t border-b border-[#E6D5C1]/30 divide-y divide-[#E6D5C1]/30 w-full max-w-lg md:max-w-2xl mx-auto">
          {/* 1. HOME (Arrow right next to text) */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-start py-3.5 md:py-6 group"
          >
            <span className="inline-flex items-center gap-2 md:gap-3 font-editorial text-[var(--brand-cream)] text-3xl md:text-[46px] tracking-tight group-hover:opacity-70 transition-opacity">
              Home
              <span className="text-[17px] md:text-[24px] font-sans transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-80">
                ↗
              </span>
            </span>
          </Link>

          {/* 2. RIGHT STACK: AURA, ORIGIN, SHOP ALL (With interior divider lines) */}
          <div className="flex flex-col divide-y divide-[#E6D5C1]/20">
            {/* ORIGIN */}
            <Link
              href="/origin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 md:py-5 group"
            >
              {/* === BOTTLE SIZE CONTROL: Change h-[30px] to increase/decrease Origin bottle size === */}
              <div className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-start shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SizedImg src={asset('/b2.webp')} width={162} height={320} alt="Origin" className="h-[30px] md:h-[44px] w-auto object-contain" />
              </div>
              <span className="font-editorial text-[var(--brand-cream)] text-[23px] md:text-[34px] tracking-tight group-hover:opacity-70 transition-opacity text-right">
                ORIGIN · SPF 50+
              </span>
            </Link>

            {/* AURA */}
            <Link
              href="/aura"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 md:py-5 group"
            >
              {/* === BOTTLE SIZE CONTROL: Change h-[22px] to increase/decrease Aura jar size === */}
              <div className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-start shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SizedImg src={asset('/b1.webp')} width={445} height={320} alt="Aura" className="h-[22px] md:h-[32px] w-auto object-contain" />
              </div>
              <span className="font-editorial text-[var(--brand-cream)] text-[23px] md:text-[34px] tracking-tight group-hover:opacity-70 transition-opacity text-right">
                AURA · SPF 40
              </span>
            </Link>

            {/* Shop All */}
            <Link
              href="/all-products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-end py-3 md:py-5 group"
            >
              <span className="font-editorial text-[var(--brand-cream)] text-[23px] md:text-[34px] tracking-tight group-hover:opacity-70 transition-opacity text-right">
                Shop All
              </span>
            </Link>
          </div>

          {/* 3. CLIMATE-SMART (Arrow right next to text) */}
          <Link
            href="/climate"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-start py-3.5 md:py-6 group"
          >
            <span className="inline-flex items-center gap-2 md:gap-3 font-editorial text-[var(--brand-cream)] text-3xl md:text-[46px] tracking-tight group-hover:opacity-70 transition-opacity">
              Climate-smart
              <span className="text-[17px] md:text-[24px] font-sans transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-80">
                ↗
              </span>
            </span>
          </Link>

          {/* 4. SKINWEAR™ (Same Editorial font style & color + 1-2px larger) */}
          <Link
            href="/skinwear"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-start py-3.5 md:py-6 group"
          >
            <span className="inline-flex items-center gap-2 md:gap-3 font-editorial text-[var(--brand-cream)] text-3xl md:text-[46px] tracking-tight group-hover:opacity-70 transition-opacity">
              Skinwear<span className="font-editorial text-[13px] sm:text-[14px] md:text-[20px] -mt-3.5 md:-mt-5 tracking-normal">TM</span>
              <span className="text-[17px] md:text-[24px] font-sans transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </span>
          </Link>

          {/* 5. ABOUT (Arrow right next to text) */}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-start py-3.5 md:py-6 group"
          >
            <span className="inline-flex items-center gap-2 md:gap-3 font-editorial text-[var(--brand-cream)] text-3xl md:text-[46px] tracking-tight group-hover:opacity-70 transition-opacity">
              About
              <span className="text-[17px] md:text-[24px] font-sans transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-80">
                ↗
              </span>
            </span>
          </Link>
        </nav>

        <div className="pt-4 md:pt-6 border-t border-[#E6D5C1]/10 text-[#E8DCC8]/40 text-xs md:text-sm font-suisse tracking-wider uppercase w-full max-w-lg md:max-w-2xl mx-auto">
          Artisun Skinwear · 2026
        </div>
      </div>


    </>
  );
}