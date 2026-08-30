'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';
import { useCart } from './cart/CartProvider';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeHeader({ ready = false }: { ready?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setOpen: setCartOpen, cart } = useCart();
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuLogoRef = useRef<HTMLButtonElement>(null);

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

    img.style.transformOrigin = 'left top';
    img.style.willChange = 'transform';

    const measure = () => {
      // Read the resting box with the transform neutralised, then restore it in
      // the same frame so nothing is ever painted mid-measure.
      img.style.transform = 'none';
      const r = img.getBoundingClientRect();

      const isDesktop = window.innerWidth >= 1024;
      const isMd = window.innerWidth >= 768;
      const padY = isDesktop ? 24 : 16;
      const padX = isDesktop ? 40 : isMd ? 24 : 16;
      const compactW = isDesktop ? 140 : 100;

      geo.scale = r.width > 0 ? compactW / r.width : 1;
      geo.tx = padX - r.left;
      geo.ty = padY - r.top;

      travel = Math.max(1, window.innerHeight * 0.85);
      lastWidth = window.innerWidth;
      paint(smoothed);
    };

    const paint = (p: number) => {
      const s = 1 + (geo.scale - 1) * p;
      img.style.transform = `translate3d(${geo.tx * p}px, ${geo.ty * p}px, 0) scale(${s})`;

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
      // Light critically-damped follow: kills scroll jitter without adding
      // noticeable lag. Snap once we're inside a pixel of the target so the
      // transform string stops changing and the layer can settle.
      smoothed += (target - smoothed) * 0.18;
      if (Math.abs(target - smoothed) < 0.0004) smoothed = target;
      paint(smoothed);
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

  return (
    <>

<header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
      >
        {/* Scroll-Revealed Container (Header Gradient Bar + Buttons) */}
        <div
          ref={navRef}
          className="w-full flex items-center justify-between px-4 md:px-10 py-2.5 md:py-6 opacity-0 transition-opacity pointer-events-none bg-gradient-to-r from-[#D9381E]/95 via-[#9E1B0E]/95 to-[#500A06]/95 backdrop-blur-md md:[background:none] md:backdrop-blur-none border-b border-[#E8DAC7]/15 md:border-b-0 shadow-[0_4px_20px_rgba(0,0,0,0.25)] md:shadow-none"
        >
          {/* Left: Spacer placeholder for docked wordmark */}
          <div className="flex items-center pointer-events-none">
            <span className="w-[100px] md:w-[145px] h-[36px]" aria-hidden />
          </div>

          {/* Desktop Right Corner: Beige Modular Tabs Box */}
          <div className="hidden md:flex items-center gap-[4px] pointer-events-auto">
            {/* Climate-smart */}
            <Link
              href="/climate"
              className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
            >
              Climate-smart
            </Link>

            {/* Origin Bottle Box */}
            <Link
              href="/origin"
              aria-label="Origin SPF 50+"
              className="group bg-[#E8DAC7] hover:bg-[#A52A2C] px-3.5 py-1.5 flex items-end justify-center transition-all duration-200 h-[36px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/origin.png')}
                alt="Origin"
                className="h-[25px] w-auto object-contain"
              />
            </Link>

            {/* Aura Jar Box */}
            <Link
              href="/aura"
              aria-label="Aura SPF 40"
              className="group bg-[#E8DAC7] hover:bg-[#A52A2C] px-3.5 py-1.5 flex items-end justify-center transition-all duration-200 h-[36px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/aura.png')}
                alt="Aura"
                className="h-[16px] w-auto object-contain"
              />
            </Link>

            {/* Skinwear™ */}
            <Link
              href="/skinwear"
              className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
            >
              Skinwear™
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
            >
              About
            </Link>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${cart?.totalQuantity ? `, ${cart.totalQuantity} items` : ''}`}
              className="group relative bg-[#E8DAC7] hover:bg-[#A52A2C] px-3.5 py-1.5 flex items-center justify-center transition-all duration-200 h-[36px] cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#A52A2C] group-hover:text-[#E8DAC7] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1.5"></circle>
                <circle cx="20" cy="21" r="1.5"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {!!cart?.totalQuantity && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#A52A2C] text-[#E8DAC7] text-[10px] font-suisse font-medium grid place-items-center">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Bag (Left) + RR Logo (Right) */}
          <div className="md:hidden flex items-center gap-3.5 pointer-events-auto">
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
                <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#E8DAC7] text-[#78100E] text-[9px] font-suisse font-bold grid place-items-center">
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
              <img
                src={asset('/logo-artisun.svg')}
                alt="Menu"
                className="h-6 w-auto object-contain [filter:brightness(0)_saturate(100%)_invert(87%)_sepia(11%)_saturate(671%)_hue-rotate(345deg)_brightness(97%)_contrast(90%)]"
              />
            </button>
          </div>
        </div>

        {/* Flying Animated Wordmark.
            Mobile/tablet: the wordmark rests on the FLOOR of the first screen —
            the box is a full 100svh tall and aligns its child to the bottom, so
            the resting position tracks the real visible viewport rather than a
            guessed percentage. Desktop keeps its original top-anchored spot. */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[100svh] flex items-end justify-center pb-[4.5svh] lg:h-auto lg:items-start lg:pb-0 lg:pt-[8vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={wordmarkRef}
            src={asset('/Artisun Primary Logo.webp')}
            alt="ARTISUN"
            className="pointer-events-auto w-[min(90vw,1300px)] h-auto select-none drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)]"
            draggable={false}
          />
        </div>
      </header>

      {/* Mobile Drawer (Right to Left Slide) */}
      <div
        data-lenis-prevent="true"
        className={`fixed inset-0 z-[120] bg-[#120404]/95 backdrop-blur-2xl md:hidden transition-transform duration-500 ease-out flex flex-col justify-between p-7 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/logo-artisun.svg')} alt="Artisun Icon" className="w-full h-full object-contain brightness-0 invert opacity-80" />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6 my-auto">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-editorial text-[var(--brand-cream)] text-3xl tracking-tight hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/climate" onClick={() => setMobileMenuOpen(false)} className="font-editorial text-[var(--brand-cream)] text-3xl tracking-tight hover:opacity-70 transition-opacity">
            Climate-smart
          </Link>
          <div className="flex flex-col gap-4 py-3 border-y border-white/10">
            <Link href="/origin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 font-editorial text-[var(--brand-cream)] text-2xl hover:opacity-70 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/b2.webp')} alt="Origin" className="h-6 w-auto object-contain" />
              <span>ORIGIN · SPF 50+</span>
            </Link>
            <Link href="/aura" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 font-editorial text-[var(--brand-cream)] text-2xl hover:opacity-70 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/b1.webp')} alt="Aura" className="h-5 w-auto object-contain" />
              <span>AURA · SPF 40</span>
            </Link>
          </div>
          <Link href="/skinwear" onClick={() => setMobileMenuOpen(false)} className="font-editorial text-[var(--brand-cream)] text-3xl tracking-tight hover:opacity-70 transition-opacity">
            Skinwear™
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="font-editorial text-[var(--brand-cream)] text-3xl tracking-tight hover:opacity-70 transition-opacity">
            About
          </Link>
        </nav>

        <div className="pt-4 border-t border-white/10 text-white/40 text-xs font-suisse tracking-wider uppercase">
          Artisun Skinwear · 2026
        </div>
      </div>


    </>
  );
}