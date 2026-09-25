'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from '@/components/media/SizedImage';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AddToBagButton from '@/components/cart/AddToBagButton';
import { asset } from '@/lib/asset';

const GALLERY_IMAGES = [
  { id: 1, label: 'Both angled', src: '/Bundle image 1 (1).png' },
  { id: 2, label: 'Pearls close', src: '/IMG_2805.PNG' },
  { id: 2, label: 'Pearls close', src: '/Bundle image 2.png' },
  { id: 3, label: 'Emulsion texture', src: '/Bundle image 3.jpg' },
  { id: 4, label: 'On skin', src: '/Bundle image 4.png' },
  { id: 5, label: 'Dry vs humid', src: '/Bundle image 5.png' },
  { id: 6, label: 'Both in hand', src: '/Bundle image 6.png' },
];

export default function WeatherDuoShowcase() {
  const [selectedImg, setSelectedImg] = useState<string>(GALLERY_IMAGES[0].src);
  const touchStartX = useRef<number | null>(null);

  // ── Horizontal Scroll Refs for Desktop ──
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // Sirf Desktop (>= 1024px) par horizontal scroll chalega
    mm.add('(min-width: 1024px)', () => {
      if (!horizontalContainerRef.current || !horizontalTrackRef.current) return;

      const track = horizontalTrackRef.current;
      const getTotalScroll = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getTotalScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalContainerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getTotalScroll()}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
      };
    });

    // Images load hone par layout shift / jumping ko refresh karega
    const images = Array.from(document.querySelectorAll('img'));
    let pending = images.filter((img) => !img.complete).length;
    if (pending === 0) {
      ScrollTrigger.refresh();
    } else {
      const onLoad = () => {
        pending -= 1;
        if (pending === 0) ScrollTrigger.refresh();
      };
      images.forEach((img) => {
        if (!img.complete) img.addEventListener('load', onLoad, { once: true });
      });
    }

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* ── DESKTOP HORIZONTAL WRAPPER (Mobile stays normal vertical) ── */}
      <div ref={horizontalContainerRef} className="relative w-full overflow-hidden">
        <div
          ref={horizontalTrackRef}
          className="flex flex-col lg:flex-row lg:w-max lg:h-screen lg:overflow-hidden will-change-transform"
        >
          {/* ── 1. FRAME 1: HERO & GALLERY ── */}
          <section className="relative z-10 w-full lg:w-screen lg:min-w-[100vw] lg:h-screen lg:flex-shrink-0 flex items-center justify-center pt-28 sm:pt-32 lg:pt-28 lg:pb-24 pb-6 sm:pb-8 px-5 sm:px-8 lg:px-14 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="max-w-[1180px] w-full mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-2.5 md:gap-12 items-center">

              {/* Left: Gallery */}
              <div className="flex flex-col gap-2.5 w-full lg:max-w-[600px] xl:max-w-[850px] mx-auto">
                <div
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current === null) return;
                    const diff = touchStartX.current - e.changedTouches[0].clientX;
                    const threshold = 40; // minimum swipe distance (px)

                    if (Math.abs(diff) > threshold) {
                      const cur = GALLERY_IMAGES.findIndex((img) => img.src === selectedImg);
                      if (diff > 0) {
                        // Swipe Left -> Agli image
                        const next = (cur + 1) % GALLERY_IMAGES.length;
                        setSelectedImg(GALLERY_IMAGES[next].src);
                      } else {
                        // Swipe Right -> Pichli image
                        const prev = (cur - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
                        setSelectedImg(GALLERY_IMAGES[prev].src);
                      }
                    }
                    touchStartX.current = null;
                  }}
                  className="relative w-full aspect-square max-h-[54svh] lg:max-h-[66vh] rounded-[14px] overflow-hidden bg-black/40 border border-white/15 shadow-2xl backdrop-blur-sm group touch-pan-y"
                >
                  <Image
                    src={asset(selectedImg)}
                    alt="The Weather Duo - Origin + Aura"
                    fill
                    priority
                    className="object-cover transition-all duration-300"
                  />

                  {/* Left Arrow (<) - Desktop Only */}
                  <button
                    type="button"
                    onClick={() => {
                      const cur = GALLERY_IMAGES.findIndex((img) => img.src === selectedImg);
                      const prev = (cur - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
                      setSelectedImg(GALLERY_IMAGES[prev].src);
                    }}
                    aria-label="Previous photo"
                    className="hidden lg:flex absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/20 text-[#F3ECE0] items-center justify-center backdrop-blur-sm transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Right Arrow (>) - Desktop Only */}
                  <button
                    type="button"
                    onClick={() => {
                      const cur = GALLERY_IMAGES.findIndex((img) => img.src === selectedImg);
                      const next = (cur + 1) % GALLERY_IMAGES.length;
                      setSelectedImg(GALLERY_IMAGES[next].src);
                    }}
                    aria-label="Next photo"
                    className="hidden lg:flex absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/20 text-[#F3ECE0] items-center justify-center backdrop-blur-sm transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnails Strip */}
                <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none snap-x snap-mandatory">
                  {GALLERY_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImg(img.src)}
                      className={`relative flex-shrink-0 h-[46px] w-[46px] lg:h-[52px] lg:w-[52px] rounded-md overflow-hidden border snap-start transition-all duration-300 ${selectedImg === img.src
                          ? 'opacity-100 border-[#E6D5C1]/75'
                          : 'opacity-50 border-[#E6D5C1]/20 hover:opacity-80'
                        }`}
                    >
                      <Image src={asset(img.src)} alt={img.label} fill sizes="52px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Product Editorial Details (Exact 1:1 Match with OriginHero Typography) */}
              <div className="order-2 flex flex-col justify-center w-full max-w-[440px] md:max-w-none lg:max-w-[540px] gap-2 md:gap-3.5 lg:gap-2.5 py-0 text-left">
                {/* 1. Outlined tag pills (Exact TagPills sizing from Origin) */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0">
                  <span className="font-suisse text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-[var(--brand-cream)]/90 px-3 py-1 rounded-full border border-white/20 bg-white/[0.04]">
                    ORIGIN + AURA
                  </span>
                  <span className="font-suisse text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-[var(--brand-cream)]/90 px-3 py-1 rounded-full border border-white/20 bg-white/[0.04]">
                    SUN · RAIN · SMOG
                  </span>
                  <span className="font-suisse text-[10px] sm:text-[11px] tracking-wider uppercase font-medium text-[var(--brand-cream)]/90 px-3 py-1 rounded-full border border-white/20 bg-white/[0.04]">
                    50ML + 50GM
                  </span>
                </div>

                {/* 2. Primary H1 (Exact Origin Hero font, clamp & leading) */}
                <h1 className="font-editorial text-[var(--brand-cream)] text-[21px] sm:text-[26px] md:text-[32px] lg:text-[34px] leading-[1.08] tracking-tight mt-0.5 md:mt-0">
                  The Weather Duo
                </h1>

                {/* 3. Subheadings & Description (Exact font-suisse sizes & line-heights) */}
                <div className="w-full font-suisse text-[var(--brand-cream)]/85 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13.5px] leading-[1.4] md:leading-[1.45] mt-0 md:mt-1 space-y-0.5 md:space-y-1">
                  <p className="text-[var(--brand-cream)] font-medium text-[12.5px] sm:text-[13px] md:text-[14px]">
                    Sun, rain and smog don&apos;t ask for the same thing.
                  </p>
                  <p className="w-full text-left">
                    Origin is the milk emulsion for the dry months: high sun, AC indoors, and the smog that settles on skin by November. Aura is the pearl for the wet ones, when the air is thick and anything heavier slides off by noon. Sun, rain, smog. Keep both and you&apos;re dressed for all three.
                  </p>
                </div>

                {/* 4. Price + Buy (Exact Origin Hero spacing & font) */}
                <div className="flex items-center gap-3 sm:gap-4 my-1 md:my-2">
                  <span className="font-editorial text-[var(--brand-cream)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[26px]">
                    ₹3,298
                  </span>
                  <AddToBagButton
                    product="duo"
                    className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 md:px-7 py-2 md:py-2.5 bg-[var(--brand-cream)] text-[var(--brand-dark)] hover:bg-white transition-colors font-medium rounded-sm"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ── 2. FRAME 2: WHY BOTH & DUAL CARDS ── */}
          <section className="relative z-10 w-full lg:w-screen lg:min-w-[100vw] lg:h-screen lg:flex-shrink-0 flex items-center justify-center pt-10 sm:pt-12 pb-10 lg:pt-24 lg:pb-24 px-5 sm:px-8 lg:px-12 select-none">
            <div className="max-w-[1360px] w-full mx-auto flex flex-col justify-center my-auto">

              <div className="space-y-1.5 w-full text-left">
                <span className="text-[10.5px] tracking-[0.24em] uppercase text-[#E8DCC8]/70 font-medium block">
                  Why both
                </span>

                <h2 className="font-editorial text-[24px] sm:text-[30px] lg:text-[58px] leading-[1.08] lg:leading-[1.03] font-normal text-[#F3ECE0] min-[1440px]:whitespace-nowrap tracking-tight">
                  You don&apos;t wear the same thing in July and November.
                </h2>

                <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] leading-relaxed text-[#F3ECE0]/85 font-light max-w-[110ch] pt-0.5">
                  Your skin doesn&apos;t either. The sun is the one constant. Everything around it changes: sticky in July, hazy and dry by November. One texture is built for each, and owning both is how you stop compromising for nine months of the year.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-5 lg:mt-6 w-full">
                {/* ── COLUMN 1: ORIGIN ── */}
                <div className="flex flex-col gap-3">
                  <article className="border border-white/15 rounded-[16px] overflow-hidden bg-black/40 backdrop-blur-md shadow-xl hover:border-white/25 transition-all flex flex-col">
                    <Link href="/origin" className="relative w-full aspect-[16/8.2] max-h-[145px] sm:max-h-[165px] lg:max-h-[185px] bg-[#1a0504] block cursor-pointer group overflow-hidden">
                      <Image
                        src={asset('/origion 1920x1080.png')}
                        alt="Origin Dry Heat"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    <div className="p-3.5 sm:p-4 lg:p-4.5 flex flex-col gap-1 flex-1 justify-between text-left">
                      <div>
                        <span className="text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-[#E8DCC8]/75 font-medium">
                          Dry heat · air conditioning · smog days
                        </span>
                        <h3 className="font-editorial text-lg sm:text-xl lg:text-[22px] text-[#F3ECE0] mt-0.5">
                          Origin
                        </h3>
                        <p className="text-[12px] sm:text-[13px] lg:text-[13.5px] leading-relaxed text-[#F3ECE0]/80 font-light mt-0.5">
                          A milk emulsion doing four jobs: serum, moisturiser, sunscreen, primer. Goes on first, on clean skin, alone or under makeup.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-1 border-t border-white/10">
                        <span className="border border-white/20 rounded-full px-2.5 py-0.5 text-[10.5px] text-[#F3ECE0]/90 bg-white/[0.04]">
                          Pollution defence
                        </span>
                        <span className="border border-white/20 rounded-full px-2.5 py-0.5 text-[10.5px] text-[#F3ECE0]/90 bg-white/[0.04]">
                          Barrier repair
                        </span>
                        <span className="border border-white/20 rounded-full px-2.5 py-0.5 text-[10.5px] text-[#F3ECE0]/90 bg-white/[0.04]">
                          Sits under makeup
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* ── ORIGIN: OUTSIDE BOX LINK (Desktop Only) ── */}
                  <Link
                    href="/origin"
                    className="hidden lg:inline-flex items-center gap-2 w-fit text-left px-1.5 py-1 text-[16px] sm:text-[18px] font-editorial text-[#F3ECE0] hover:text-white transition-colors leading-snug tracking-wide group"
                  >
                    <span>Origin, in full</span>
                    <span aria-hidden="true" className="text-[17px] font-light opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      ↗
                    </span>
                  </Link>
                </div>

                {/* ── COLUMN 2: AURA ── */}
                <div className="flex flex-col gap-3">
                  <article className="border border-white/15 rounded-[16px] overflow-hidden bg-black/40 backdrop-blur-md shadow-xl hover:border-white/25 transition-all flex flex-col">
                    <Link href="/aura" className="relative w-full aspect-[16/8.2] max-h-[145px] sm:max-h-[165px] lg:max-h-[185px] bg-[#1a0504] block cursor-pointer group overflow-hidden">
                      <Image
                        src={asset('/aura 1920x1080 size.png')}
                        alt="Aura Pearl Humid Day"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    <div className="p-3.5 sm:p-4 lg:p-4.5 flex flex-col gap-1 flex-1 justify-between text-left">
                      <div>
                        <span className="text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-[#E8DCC8]/75 font-medium">
                          Dual hydration · humidity
                        </span>
                        <h3 className="font-editorial text-lg sm:text-xl lg:text-[22px] text-[#F3ECE0] mt-0.5">
                          Aura Pearl
                        </h3>
                        <p className="text-[12px] sm:text-[13px] lg:text-[13.5px] leading-relaxed text-[#F3ECE0]/80 font-light mt-0.5">
                          Pearls you can see and count, held in a barrier-repairing gel. They break on skin, sink in, and leave nothing behind.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-1 border-t border-white/10">
                        <span className="border border-white/20 rounded-full px-2.5 py-0.5 text-[10.5px] text-[#F3ECE0]/90 bg-white/[0.04]">
                          Humidity defence
                        </span>
                        <span className="border border-white/20 rounded-full px-2.5 py-0.5 text-[10.5px] text-[#F3ECE0]/90 bg-white/[0.04]">
                          Calms &amp; repairs
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* ── AURA: OUTSIDE BOX LINK (Desktop Only) ── */}
                  <Link
                    href="/aura"
                    className="hidden lg:inline-flex items-center gap-2 w-fit text-left px-1.5 py-1 text-[17px] font-editorial text-[#F3ECE0] hover:text-white transition-colors leading-none tracking-wide group"
                  >
                    <span className="leading-none">Aura, in full</span>
                    <span aria-hidden="true" className="text-[15px] font-light leading-none opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      ↗
                    </span>
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* ── 3. FRAME 3: LINKS & FAQ (Mobile only, Desktop hidden) ── */}
          <section className="lg:hidden relative z-10 w-full flex items-center justify-center pt-2 pb-10 px-5 sm:px-8 select-none">
            <div className="max-w-[880px] w-full mx-auto flex flex-col justify-center">

              <div className="border-b border-white/20 divide-y divide-white/20 w-full">
                <Link
                  href="/origin"
                  className="flex items-center justify-between py-4 sm:py-5 text-base sm:text-lg lg:text-[19px] font-editorial text-[#F3ECE0] hover:text-[#E8DCC8] transition-colors group"
                >
                  <span className="tracking-wide">Origin, in full</span>
                  <span className="text-[17px] font-light opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </Link>

                <Link
                  href="/aura"
                  className="flex items-center justify-between py-4 sm:py-5 text-base sm:text-lg lg:text-[19px] font-editorial text-[#F3ECE0] hover:text-[#E8DCC8] transition-colors group"
                >
                  <span className="tracking-wide">Aura Pearl, in full</span>
                  <span className="text-[17px] font-light opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </Link>

                <div className="py-5 sm:py-6 flex flex-col gap-1.5 text-left">
                  <b className="font-editorial text-base sm:text-lg lg:text-[19px] text-[#F3ECE0] font-normal tracking-wide">
                    Which one do I start with?
                  </b>
                  <p className="font-suisse text-[13.5px] sm:text-[15px] text-[#F3ECE0]/80 leading-relaxed font-light">
                    Origin in the morning, on clean skin. Aura when the air is heavy, or over the top later in the day.
                  </p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* ── STICKY BOTTOM BAR (Origin Transparent Style Match) ── */}
      <div className="fixed bottom-0 left-0 w-full h-11 sm:h-12 z-[60] bg-black/20 backdrop-blur-md border-t border-white/10 pointer-events-auto transition-all">
        <div className="h-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between">

          {/* Left: Compact Thumb + Title + Subtitle */}
          <div className="flex items-center gap-3">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden shrink-0 border border-white/15">
              <Image
                src={asset('/Collection page right.png')}
                alt="Weather Duo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-[var(--brand-cream)] text-sm sm:text-base leading-none tracking-wide whitespace-nowrap">
                THE WEATHER DUO
              </span>
              <span className="hidden md:inline font-suisse text-[10px] text-[var(--brand-cream)]/50 tracking-[0.14em] uppercase">
                · Origin (50ml) + Aura (50g)
              </span>
            </div>
          </div>

          {/* Right: Sleek Price + Clean Minimal Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="font-editorial text-[var(--brand-cream)] text-sm sm:text-base whitespace-nowrap">
              ₹3,298
            </span>
            <AddToBagButton
              product="duo"
              className="font-suisse text-[10px] sm:text-[11px] uppercase tracking-[0.14em] px-4 sm:px-5 py-1.5 bg-[var(--brand-cream)] text-[var(--brand-dark,#1a1a1a)] font-medium hover:bg-white transition-colors"
            />
          </div>

        </div>
      </div>
    </>
  );
}