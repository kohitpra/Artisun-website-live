'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import TagPills from '@/components/pdp/TagPills';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';
import AddToBagButton from '@/components/cart/AddToBagButton';

const BADGES = ['SPF 50+', 'PA++++', 'All Skin Types', 'All Weathers'];

const DETAILS = [
  {
    title: 'WHAT MAKES IT DIFFERENT',
    body: 'Pearls you choose as per the weather — more when it’s dry, fewer when it’s humid.',
  },
  {
    title: 'HOW IT WEARS',
    body: 'Pearls that melt into a fresh gel. A soft, dewy finish, never heavy.',
  },
  {
    title: "WHAT'S INSIDE",
    body: 'Ectoin, Bisabolol and Sodium Hyaluronate',
  },
];

const FULL_NAME = 'ORIGIN · 4-in-1 Milk Emulsion SPF 50+';
const PRICE = '₹1,499';
const SIZE = '50ml';
const IMG_DESKTOP = '/pdp/origin-last-desktop.webp';
const IMG_MOBILE = '/pdp/origin-last-mobile.webp';


export default function OriginProduct() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  usePanelEdgeScroll(scrollerRef);

  return (
    <div
      id="origin-product"
      className="origin-panel relative w-screen shrink-0 h-[100svh] overflow-hidden"
    >
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      <div
        ref={scrollerRef}
        className="panel-scroll lg:overflow-hidden h-full flex flex-col items-center justify-start lg:justify-center pt-[76px] pb-24 sm:pt-24 sm:pb-24 lg:py-0"
      >
        {/* Desktop: copy LEFT, image RIGHT. Mobile: stacked, square image on top.
            Was a single centred column at every width, which read as a phone
            layout on a 1440px screen. */}
        <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-14 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6 lg:gap-14 items-center my-auto">

          {/* ── COPY — left on desktop, second on mobile ── */}
          <div className="order-2 lg:order-1 w-full max-w-[520px] lg:max-w-none mx-auto flex flex-col items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4">

            <div className="flex flex-col items-center lg:items-start w-full">
              <h2 className="font-editorial tracking-tight leading-[1.05] text-[var(--brand-cream)] text-[clamp(19px,4.9vw,48px)] whitespace-nowrap lg:whitespace-normal">
            {FULL_NAME}
          </h2>
              <TagPills tags={BADGES} align="start" className="mt-3 sm:mt-4 justify-center lg:justify-start" />
            </div>

            <div className="w-full max-w-[360px] lg:max-w-[420px] p-3 sm:p-4 rounded-xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-lg space-y-2 sm:space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-editorial text-[var(--brand-cream)] text-[20px] sm:text-[24px] leading-none">
                  {PRICE} <span className="font-suisse text-xs text-[var(--brand-cream)]/60">· {SIZE}</span>
                </span>
                <AddToBagButton
                  product="origin"
                  className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wider px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[var(--brand-cream)] text-[var(--brand-dark,#1a1a1a)] font-medium hover:bg-white transition-colors"
                />
              </div>
              <p className="font-suisse text-[10.5px] sm:text-[11px] text-left text-[var(--brand-cream)]/50 pt-1 border-t border-white/10">
                Free shipping · Delivered in 3–5 days
              </p>
            </div>

            <div className="w-full max-w-[460px] lg:max-w-none text-left border-t border-b border-[var(--brand-cream)]/15 divide-y divide-[var(--brand-cream)]/15">
              {DETAILS.map((d) => (
                <div key={d.title} className="py-2 sm:py-2.5 lg:py-3">
                  <span className="block font-suisse text-[8px] sm:text-[9.5px] tracking-[0.18em] uppercase text-[var(--brand-cream)]/60 font-semibold mb-0.5">
                    {d.title}
                  </span>
                  <p className="font-suisse text-[11px] sm:text-[13.5px] leading-[1.35] text-[var(--brand-cream)]/90">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="font-editorial not-italic text-[var(--brand-cream)]/75 text-[16px] sm:text-[20px] tracking-tight pt-0.5">
              What&apos;s your skin wearing today?
            </p>
          </div>

          {/* ── IMAGE — right on desktop, first on mobile, square on mobile ── */}
      <div className="order-1 lg:order-2 relative w-[calc(100%+2.5rem)] -mx-5 sm:-mx-8 lg:mx-auto max-w-none lg:w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-none lg:rounded-2xl overflow-hidden shrink-0">
            <div
              className="absolute inset-0 z-0 rounded-full blur-2xl opacity-70"
              style={{ background: 'radial-gradient(circle at 50% 45%, rgba(233,85,30,0.35), transparent 65%)' }}
            />
            <Image
              src={asset(IMG_MOBILE)}
              alt={FULL_NAME}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="relative z-10 object-cover object-center lg:hidden"
              priority
            />
            <Image
              src={asset(IMG_DESKTOP)}
              alt={FULL_NAME}
              fill
              sizes="45vw"
              className="relative z-10 object-cover object-center hidden lg:block"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
