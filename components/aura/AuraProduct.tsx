'use client';

import { useRef } from 'react';
import Image from '@/components/media/SizedImage';
import { asset } from '@/lib/asset';
import TagPills from '@/components/pdp/TagPills';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';
import AddToBagButton from '@/components/cart/AddToBagButton';

const BADGES = ['SPF 40', 'PA++++', 'All Skin Types', 'All Weathers'];

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

const FULL_NAME = 'AURA · Pearl Skinwear SPF 40';
const PRICE = '₹1,799';
const SIZE = '50g';
const IMG_DESKTOP = '/pdp/aura-last-desktop.webp';
const IMG_MOBILE = '/pdp/aura-last-mobile.webp';


export default function AuraProduct() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // usePanelEdgeScroll removed

  return (
    <div
      id="aura-product"
      className="aura-panel relative w-screen shrink-0 min-h-[100svh] md:h-[100svh] lg:h-[100svh] overflow-visible md:overflow-hidden lg:overflow-hidden md:flex md:flex-col md:justify-center"
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
        className="h-full overflow-hidden flex flex-col items-center justify-center pt-0 pb-16 md:pt-20 md:pb-16 lg:py-0"
      >
        {/* Desktop: copy LEFT, image RIGHT. Mobile: stacked, square image on top.
            Was a single centred column at every width, which read as a phone
            layout on a 1440px screen. */}
        <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.9fr] gap-6 md:gap-8 lg:gap-14 items-center my-auto">

          {/* ── COPY — left on desktop & tablet, second on mobile ── */}
          <div className="order-2 md:order-1 w-full max-w-[520px] md:max-w-none mx-auto flex flex-col items-center md:items-start text-center md:text-left gap-3 sm:gap-4 md:gap-6">

            <div className="flex flex-col items-center md:items-start w-full">
              <h2 className="font-editorial text-[#E8DCC8] text-[24px] sm:text-[34px] md:text-[44px] lg:text-[40px] xl:text-[44px] leading-[1.08] tracking-tight not-italic break-words w-full text-center md:text-left">
                {FULL_NAME}
              </h2>
              <TagPills tags={BADGES} align="start" className="mt-2.5 sm:mt-3.5 md:mt-4 justify-center md:justify-start" />
            </div>

            <div className="w-full max-w-[360px] md:max-w-[480px] p-3 sm:p-4 md:p-5 rounded-xl bg-white/[0.06] border border-[#E6D5C1]/15 backdrop-blur-md shadow-lg space-y-2 sm:space-y-2.5 md:space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-editorial text-[var(--brand-cream)] text-[20px] sm:text-[24px] md:text-[28px] leading-none">
                  {PRICE} <span className="font-suisse text-xs md:text-sm text-[var(--brand-cream)]/60">· {SIZE}</span>
                </span>
                <AddToBagButton
                  product="aura"
                  className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wider px-3.5 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-[var(--brand-cream)] text-[var(--brand-dark,#1a1a1a)] font-medium hover:bg-white transition-colors"
                />
              </div>
              <p className="font-suisse text-[10.5px] sm:text-[11px] md:text-[12.5px] text-left text-[var(--brand-cream)]/50 pt-1 md:pt-2 border-t border-[#E6D5C1]/20">
                Free shipping · Delivered in 3–5 days
              </p>
            </div>

            <div className="w-full max-w-[460px] md:max-w-none text-left border-t border-b border-[#E6D5C1] divide-y divide-[#E6D5C1]">
              {DETAILS.map((d) => (
                <div key={d.title} className="py-2 sm:py-2.5 md:py-4 lg:py-3">
                  <span className="block font-suisse text-[8px] sm:text-[9.5px] md:text-[10.5px] tracking-[0.18em] uppercase text-[var(--brand-cream)]/60 font-semibold mb-0.5">
                    {d.title}
                  </span>
                  <p className="font-suisse text-[11px] sm:text-[13.5px] md:text-[15px] leading-[1.35] md:leading-[1.4] text-[var(--brand-cream)]/90">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="font-editorial not-italic text-[var(--brand-cream)]/75 text-[16px] sm:text-[20px] md:text-[26px] tracking-tight pt-0.5 md:pt-2">
              What&apos;s your skin wearing today?
            </p>
          </div>

          {/* ── IMAGE — right on desktop & tablet, first on mobile ── */}
          <div className="order-1 md:order-2 relative w-[calc(100%+2.5rem)] md:w-full md:max-w-[520px] md:h-[580px] -mx-5 sm:-mx-8 md:mx-auto max-w-none aspect-[4/3] sm:aspect-square md:aspect-auto lg:aspect-[1/1] lg:max-w-none lg:h-auto rounded-none md:rounded-2xl overflow-hidden shrink-0">
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
