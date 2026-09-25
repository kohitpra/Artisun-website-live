'use client';

import React, { useState } from 'react';
import Image from '@/components/media/SizedImage';
import Link from 'next/link';
import AddToBagButton from '@/components/cart/AddToBagButton';
import { asset } from '@/lib/asset';

// ── DATA: TRUST CLAIMS ──
const TRUST_BADGES = [
  'Made in India',
  'In-vitro tested',
  'Non-comedogenic',
  'Vegan, cruelty-free',
  'Zero White Cast',
  'No Parabens',
];

// ── DATA: PRODUCTS ──
  const PRODUCTS = [
  {
    id: 'origin',
    name: 'Origin',
    subtitle: '4-in-1 Milk Emulsion SPF 50+ · PA++++',
    size: '50ml',
    finish: 'Wears dewy, light & protective',
    price: '₹1,499',
    image: '/origin-shop-1.jpg',
    desc: 'Four-in-one sunscreen, moisturiser, primer, and antioxidant barrier.',
  },
  {
    id: 'aura',
    name: 'Aura',
    subtitle: 'Pearl Skinwear SPF 40 · PA++++',
    size: '50g',
    finish: 'Wears weightless, plush & invisible',
    price: '₹1,799',
    image: '/aura-coll-1.jpg',
    desc: 'Pearls suspended in hydrating gel. Adjust the amount to the weather—more when dry, fewer when humid.',
  },
  {
    id: 'duo-bundle',
    name: 'The Weather Duo',
    subtitle: 'Origin (50ml) + Aura (50g)',
    size: 'Complete Kit',
    finish: 'Your year-round dual climate wardrobe',
    price: '₹3,298',
    image: '/lansdcape image.png',
    desc: 'Origin for high sun & commute; Aura for deep hydration & humidity. The complete Indian weather collection.',
  },
];

// ── DATA: CLIENT REVIEWS (All 10 from brief) ──
const REVIEWS = [
  {
    quote: "Expected it to sit heavy in this weather. It doesn't. That's the whole review.",
    author: 'Meher Chandiramani',
    location: 'Mumbai · 30°C',
  },
  {
    quote: 'Bought it for the SPF, kept using it because I stopped needing a separate primer.',
    author: 'Ananya Rege',
    location: 'Pune · 27°C',
  },
  {
    quote: "Third sunscreen this year. First one that didn't go grey on me in photos.",
    author: 'Divya Balakrishnan',
    location: 'Chennai · 33°C',
  },
  {
    quote: "Two pearls, done. Takes ten seconds and I genuinely forget it's on.",
    author: 'Rhea Sabharwal',
    location: 'Delhi · 34°C',
  },
  {
    quote: 'My mother has taken it. I am buying a second one. Make of that what you will.',
    author: 'Ishaan Grover',
    location: 'Chandigarh · 32°C',
  },
  {
    quote: 'Skin looks lit rather than shiny, which I didn’t think was a real distinction until now.',
    author: 'Tanvi Deshmukh',
    location: 'Bengaluru · 26°C',
  },
  {
    quote: 'Used it through two weeks of Bombay humidity. No pilling, no sliding.',
    author: 'Farhan Qureshi',
    location: 'Mumbai · 30°C',
  },
  {
    quote: "Not cheap. Also the only one I've finished the bottle of.",
    author: 'Sneha Bhattacharya',
    location: 'Kolkata · 32°C',
  },
  {
    quote: 'Wore it under makeup for a nine-hour shoot day. Nothing broke up around the nose.',
    author: 'Aditi Menon',
    location: 'Kochi · 29°C',
  },
  {
    quote: 'I have written off about six sunscreens for the smell alone. This one is fine.',
    author: 'Karan Malhotra',
    location: 'Jaipur · 33°C',
  },
];

// ── DATA: FAQS (All 8 from brief) ──
const FAQS = [
  {
    q: 'Which one should I get – Origin or Aura?',
    a: 'Origin if you want a dewy finish and one step that does four things: primer, moisturiser, serum and sun protection. Aura if you want the sunscreen to disappear entirely — nothing to see, nothing to feel. Origin is SPF 50+ PA++++, 50ml, in a glass pump. Aura is SPF 40 PA++++, 50g, in a glass jar with a spatula. Both are non-comedogenic, vegan and in-vivo tested. You’re choosing by finish and by weather, not by skin type.',
  },
  {
    q: 'Is SPF 40 enough, or should I take SPF 50+?',
    a: 'SPF 50+ filters about 98% of UVB. SPF 40 filters about 97.5%. The gap between those two numbers is far smaller than the gap between wearing enough and wearing too little. Artisun Origin is SPF 50+ PA++++ and Aura is SPF 40 PA++++ — both carry the highest UVA rating there is, and UVA is what drives pigmentation and ageing. Take Origin for long stretches outdoors. Take Aura if it’s the one you’ll actually wear every day.',
  },
  {
    q: 'Do these leave a white cast?',
    a: 'No. Neither Artisun Origin nor Aura contains zinc oxide or titanium dioxide. Those are white minerals that sit on the surface of skin, and they are the reason most sunscreens go grey on deeper tones. Both formulas use chemical UV filters instead, which absorb into the film rather than sitting on top of it.',
  },
  {
    q: 'What does 4-in-1 actually mean?',
    a: 'Artisun Origin is a primer, a moisturiser, a serum and a sunscreen in one bottle. Designed as four, worn as one. The step most people skip is now the same step as the ones they don’t.',
  },
  {
    q: 'What’s the difference in finish?',
    a: 'Origin wears dewy — skin looks lit rather than flat, and it holds makeup well because it is also the primer. Aura wears invisible — no shine, no film, nothing on the surface. Neither is a matte finish. If you want skin flattened down, neither of these is that.',
  },
  {
    q: 'Will these work for oily skin? Dry skin? Sensitive skin?',
    a: 'Both Artisun formulas are built for every skin type, and both are non-comedogenic. That is the argument the brand rests on: what should decide your sunscreen is the weather and the day, not a label you were given once at nineteen. Oily skin in Delhi in June and oily skin in Delhi in January want two different things.',
  },
  {
    q: 'How much do I use?',
    a: 'Origin — two pumps, three in dry, cold or high-sun weather. Aura — two pearls in heat and humidity, up to three when it’s cold or dry, one to two through monsoon. Every recommended amount delivers the full tested SPF.',
  },
  {
    q: 'Where are these made?',
    a: 'In India, at a facility in Rudrapur, Uttarakhand. The filters and actives are sourced from Germany, Finland and Japan. Shelf life is 18 months from manufacture.',
  },
];

export default function Collection({
  h1Title,
  subtitle,
}: {
  h1Title?: string;
  subtitle?: string;
} = {}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative w-full min-h-screen pt-0 pb-20 font-suisse antialiased text-[#242623]">

      <div className="relative z-10 w-full">

        {/* ══════════════════════════════════════════════════
            1. HERO / COVER SECTION (Single on Mobile, 50/50 Split on Desktop)
        ══════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden pt-12 sm:pt-14 md:pt-0 bg-[#1f0b09]">
          {/* 1 column on mobile, 2 columns edge-to-edge on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-[68svh] sm:h-[75svh] md:h-[90vh] md:min-h-[650px] lg:min-h-[720px]">

            {/* Left Side: Model Image (Edge-to-edge on desktop, hair & head framed cleanly) */}
            <div className="relative w-full h-full overflow-hidden md:border-r md:border-white/20">
              <Image
                src={asset('/Collection page model (1).jpeg')}
                alt="Artisun Model"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top md:object-[center_top]"
              />
            </div>

            {/* Right Side: Product Duo (Edge-to-edge on desktop, bottles positioned safely under header) */}
            <div className="hidden md:block relative w-full h-full overflow-hidden bg-[#1f0b09]">
              <Image
                src={asset('/Collection page right.png')}
                alt="Artisun Sunscreen Duo Products"
                fill
                priority
                sizes="50vw"
                className="object-cover object-center md:object-[center_28%]"
              />
            </div>

          </div>

          {/* Smooth legibility gradient across the bottom of both frames */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

          {/* Bottom Overlay Text: Positioned at bottom-left across the split */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-7 md:p-8 lg:p-12 pointer-events-none">
            <div className="w-full max-w-[90%] sm:max-w-[580px] lg:max-w-[700px]">
              <h1 className="font-editorial text-[26px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[1.06] tracking-tight text-[#F3ECE0] font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {h1Title || (
                  <>
                    Sun care, made<br />
                    properly.
                  </>
                )}
              </h1>
              <p className="font-suisse text-[12px] sm:text-[14px] md:text-[16px] text-[#F3ECE0]/90 leading-snug mt-2 sm:mt-2.5 max-w-[42ch] drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {subtitle || 'Two layers, built for Indian weather.'}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            2. TRUST BADGES (CLEAN AUTO-SCROLLING TICKER)
        ══════════════════════════════════════════════════ */}
        <section className="w-full pt-3.5 pb-8 sm:pt-4 sm:pb-12 md:pb-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="flex gap-4 sm:gap-6 w-max animate-badges-ticker hover:[animation-play-state:paused]">
            {[...TRUST_BADGES, ...TRUST_BADGES, ...TRUST_BADGES].map((badge, idx) => (
              <div
                key={`${badge}-${idx}`}
                className="flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/[0.04] border border-white/15 shrink-0"
              >
                <span className="font-suisse text-[9.5px] sm:text-[11px] tracking-[0.16em] uppercase font-medium text-[#E8DCC8]/90 whitespace-nowrap">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 w-full">

          {/* ══════════════════════════════════════════════════
              3. PRODUCT SHOWCASE GRID (Compact Desktop Tiles)
          ══════════════════════════════════════════════════ */}
          <section id="products" className="w-full space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-editorial text-[28px] sm:text-[44px] leading-tight text-[#E8DCC8] mt-1">
                  Choose your layer.
                </h2>
              </div>
            </div>

            {/* Mobile: 2-column grid; Desktop: 3-column compact grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6 items-stretch">
              {PRODUCTS.map((prod) => {
                const isCombo = prod.id === 'duo-bundle';
                const targetHref = prod.id === 'origin' 
                  ? '/origin' 
                  : prod.id === 'aura' 
                  ? '/aura' 
                  : '/weather-duo';

                return (
                  <div
                    key={prod.id}
                    className={`group relative flex flex-col justify-between bg-[#E6D5C1] border border-[#242623]/10 rounded-none overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${
                      isCombo ? 'col-span-2 md:col-span-1' : 'col-span-1'
                    }`}
                  >
                    {/* Clickable Image Box: Slightly taller image container on desktop */}
                    <div
                      className={`relative w-full overflow-hidden bg-[#2a0e0b] ${
                        isCombo
                          ? 'h-[190px] sm:h-[300px] md:h-[390px] lg:h-[430px]'
                          : 'h-[175px] sm:h-[300px] md:h-[390px] lg:h-[430px]'
                      }`}
                    >
                      {/* Entire image is a link */}
                      <Link
                        href={targetHref}
                        className="absolute inset-0 z-0 block cursor-pointer"
                        aria-label={`View details for ${prod.name}`}
                      >
                        <Image
                          src={asset(prod.image)}
                          alt={prod.name}
                          fill
                          sizes={
                            isCombo
                              ? '(max-width: 768px) 100vw, 33vw'
                              : '(max-width: 768px) 50vw, 33vw'
                          }
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {/* Top-Right Minimal Arrow Only */}
                      <Link
                        href={targetHref}
                        aria-label={`Open ${prod.name}`}
                        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 text-[#F3ECE0]/80 hover:text-white transition-all duration-200 hover:translate-x-0.5 hover:-translate-y-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      >
                        <svg
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </Link>
                    </div>

                    {/* Content Details: Reduced padding on desktop (p-2.5 sm:p-4 lg:p-4.5) to cut excess beige height */}
                    <div className="relative flex flex-col flex-1 justify-between p-2.5 sm:p-4 lg:p-4.5 cursor-pointer">
                      
                      <Link
                        href={targetHref}
                        className="absolute inset-0 z-0 block"
                        aria-label={`View ${prod.name}`}
                      />

                      {/* Text details */}
                      <div className="space-y-0.5 sm:space-y-1 relative z-10 pointer-events-none">
                        <div className="flex items-baseline justify-between gap-1">
                          <h3 className="font-editorial text-[15px] sm:text-xl lg:text-[22px] text-[#242623] leading-[1.1] sm:leading-tight">
                            {prod.name}
                          </h3>
                          <span className="font-suisse text-[9px] sm:text-[11px] text-[#242623]/60 shrink-0">
                            {prod.size}
                          </span>
                        </div>

                        <p className="font-suisse text-[8.5px] sm:text-[10.5px] lg:text-[11px] uppercase tracking-wider text-[#A52A2C] font-semibold leading-[1.2] sm:leading-normal">
                          {prod.subtitle}
                        </p>

                        <p
                          className={`font-suisse text-[10px] sm:text-[11px] lg:text-[11.5px] text-[#242623]/75 leading-[1.25] sm:leading-snug pt-0.5 ${
                            isCombo ? 'block' : 'hidden md:block'
                          }`}
                        >
                          {prod.desc}
                        </p>
                      </div>

                      {/* Price & CTA Button Area: Tightened vertical margins (mt-2 sm:mt-3 pt-2 sm:pt-3) */}
                      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-[#242623]/10 flex items-center justify-between gap-1.5 sm:gap-3 relative z-10">
                        <div className="pointer-events-none">
                          <span className="font-editorial text-sm sm:text-lg lg:text-xl text-[#242623] font-semibold">
                            {prod.price}
                          </span>
                        </div>

                        <div
                          className="relative z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AddToBagButton
                            product={prod.id === 'origin' ? 'origin' : prod.id === 'aura' ? 'aura' : 'duo'}
                            className="pointer-events-auto font-suisse text-[8.5px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#242623] text-[#F3ECE0] hover:bg-[#A52A2C] transition-colors font-medium rounded-none"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              4. CUSTOMER REVIEWS (AUTO-SLIDER CAROUSEL)
          ══════════════════════════════════════════════════ */}
          <section className="w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-editorial text-[30px] sm:text-[40px] leading-tight text-[#E8DCC8] mt-1">
                Tested by 30°C humidity, cold <br /> snaps, and real commutes.
              </h2>
            </div>

            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
              <div className="flex gap-4 w-max animate-carousel hover:[animation-play-state:paused]">
                {[...REVIEWS, ...REVIEWS].map((rev, idx) => (
                  <div
                    key={idx}
                    className="w-[280px] sm:w-[340px] shrink-0 p-6 rounded-2xl bg-[#E6D5C1] border border-[#242623]/10 shadow-sm flex flex-col justify-between transform-gpu"
                  >
                    <p className="font-editorial text-base sm:text-lg leading-snug text-[#242623]">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                    <div className="pt-4 mt-4 border-t border-[#242623]/10 flex items-center justify-between text-xs">
                      <span className="font-suisse font-semibold text-[#242623]">
                        {rev.author}
                      </span>
                      <span className="font-suisse text-[#A52A2C] font-medium text-[11px]">
                        {rev.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              5. FAQ SECTION (ACCORDION - PURE WHITE/CREAM TEXT)
          ══════════════════════════════════════════════════ */}
          <section className="w-full max-w-[960px] mx-auto space-y-8">
            <div className="text-center">
              <span className="text-[10px] sm:text-xs tracking-[0.24em] uppercase font-semibold text-[#E8DCC8]/70">
                Answers
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] leading-tight text-[#E8DCC8] mt-1">
                Questions people actually ask.
              </h2>
            </div>

            <div className="divide-y divide-white/20 border-y border-white/20">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className="py-4 sm:py-5">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left gap-4 group"
                    >
                      <span className="font-editorial text-lg sm:text-xl text-[#E8DCC8] group-hover:text-[#E8DCC8]/80 transition-colors">
                        {faq.q}
                      </span>
                      <span className="text-xl font-light text-[#E8DCC8]/75 shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                    >
                      <div className="overflow-hidden">
                        <p className="font-suisse text-xs sm:text-sm leading-relaxed text-[#E8DCC8]/85 pt-3">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>

      <style jsx>{`
        @keyframes carousel {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes badgesTicker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-carousel {
          animation: carousel 42s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        .animate-badges-ticker {
          animation: badgesTicker 32s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}