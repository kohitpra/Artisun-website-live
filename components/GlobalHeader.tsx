'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { useCart } from './cart/CartProvider';

import SizedImg from '@/components/media/SizedImg';
export default function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setOpen: setCartOpen, cart } = useCart();

  // Broadcast drawer open/close so ScrollProgressBar (fixed, high z-index,
  // mounted separately in OriginPage) can hide itself while the menu is
  // open. Same event HomeHeader dispatches, so ScrollProgressBar's listener
  // needs no changes — this was just the missing half.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('artisun:mobile-menu', { detail: mobileMenuOpen }));
  }, [mobileMenuOpen]);

  return (
    <>
      <header data-site-header="" className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-10 py-2.5 md:py-3.5 lg:py-6 z-[100] pointer-events-none bg-gradient-to-r from-[#D9381E]/95 via-[#9E1B0E]/95 to-[#500A06]/95 backdrop-blur-md lg:[background:none] lg:backdrop-blur-none border-b border-[#E8DAC7]/15 lg:border-b-0 shadow-[0_4px_20px_rgba(0,0,0,0.25)] lg:shadow-none">

        {/* Left: ARTISUN Wordmark Logo (Mobile, Tablet & Desktop) */}
        <div className="flex items-center pointer-events-auto">
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <SizedImg
              src={asset('/Artisun Primary Logo.webp')} width={1800} height={411}
              alt="ARTISUN"
              className="h-6 md:h-7 lg:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Right Corner: Beige Modular Tabs Box */}
        <div className="hidden lg:flex items-center gap-[4px] pointer-events-auto">
          {/* 1. Shop All */}
          <Link
            href="/all-products"
            className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
          >
            Shop All
          </Link>

          {/* 2. Origin Bottle Box */}
          <Link
            href="/origin"
            aria-label="Origin SPF 50+"
            className="group bg-[#E8DAC7] hover:bg-[#A52A2C] px-3.5 py-1.5 flex items-center justify-center transition-all duration-200 h-[36px]"
          >
            <span
              aria-hidden="true"
              className="w-[13px] h-[25px] bg-[#A52A2C] group-hover:bg-[#E8DAC7] transition-colors duration-200 block shrink-0"
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
            className="group bg-[#E8DAC7] hover:bg-[#A52A2C] px-3.5 py-1.5 flex items-center justify-center transition-all duration-200 h-[36px]"
          >
            <span
              aria-hidden="true"
              className="w-[22px] h-[16px] translate-y-[4.5px] bg-[#A52A2C] group-hover:bg-[#E8DAC7] transition-colors duration-200 block shrink-0"
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
            className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
          >
            Climate-smart
          </Link>

          {/* 5. Skinwear™ */}
          <Link
            href="/skinwear"
            className="group bg-[#E8DAC7] hover:bg-[#A52A2C] text-[#A52A2C] hover:text-[#E8DAC7] font-editorial text-[17px] tracking-tight px-4 py-1.5 flex items-center justify-center transition-all duration-200 whitespace-nowrap h-[36px]"
          >
            Skinwear™
          </Link>

          {/* 6. About */}
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
            <SizedImg
              src={asset('/logo-artisun.svg')} width={964} height={800}
              alt="Menu"
              className="h-6 w-auto object-contain [filter:brightness(0)_saturate(100%)_invert(87%)_sepia(11%)_saturate(671%)_hue-rotate(345deg)_brightness(97%)_contrast(90%)]"
            />
          </button>
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