'use client';

import { useRef } from 'react';
import Image from '@/components/media/SizedImage';
import { asset } from '@/lib/asset';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';

export default function AuraDiff() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // usePanelEdgeScroll removed

  return (
    <div className="aura-panel relative w-screen shrink-0 h-auto lg:h-[100svh] overflow-visible lg:overflow-hidden">
      {/* Red Eclipse Background */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: 'var(--bg-eclipse)' }}
      />

      {/* Main Scroller */}
      <div
        ref={scrollerRef}
        className="w-full h-full flex flex-col justify-center pt-12 pb-8 md:pt-20 md:pb-16 lg:pt-20 lg:pb-12"
      >
        <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 my-auto flex flex-col justify-center">
          
          {/* Section Kicker */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.24em] uppercase font-medium text-[var(--brand-cream)]/70 mb-1 lg:mb-1.5">
            What makes aura different
          </div>

          {/* Headline (Fitted cleanly on desktop) */}
          <h2 className="font-editorial text-[#E8DCC8] text-[30px] sm:text-[46px] md:text-[46px] lg:text-[58px] leading-[1.08] lg:leading-[1.03] tracking-tight not-italic font-normal mb-2 md:mb-5 lg:mb-3">
            Two things in one pearl: protection, and skincare.
          </h2>

          {/* Two-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 items-stretch">
            
            {/* Card 1: The Pearl */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-[#E6D5C1]/10 overflow-hidden flex flex-col justify-between">
              <div className="relative w-full h-[130px] sm:h-[180px] md:h-[270px] lg:h-[185px] xl:h-[210px] bg-[#613622] overflow-hidden">
                <Image
                  src={asset('/pdp/The pearl, Aura new frame.jpeg')}
                  alt="Aura sunscreen pearls, macro close-up"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover opacity-90"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2.5 left-3 text-[9px] uppercase tracking-[0.2em] font-medium text-[#E8DCC8]/60">
                </span>
              </div>

              <div className="p-4 sm:p-5 md:p-7 lg:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[12px] sm:text-[13px] md:text-[14px] font-suisse mb-0.5 md:mb-1">
                    THE PEARL
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl md:text-[28px] text-[#E8DCC8] font-normal mb-1 md:mb-2 tracking-tight">
                    The protection.
                  </h3>
                  <p className="font-sans text-xs sm:text-[12.5px] md:text-[14px] lg:text-[13px] leading-[1.45] md:leading-[1.55] text-[var(--brand-cream)]/85 font-light">
                    Every pearl carries the sunscreen: three broad-spectrum UV filters, including Uvinul A Plus one of the most advanced UVA filters made anywhere in the world. Alongside them, Beta-Glucan to support the skin barrier and Bisabolol to calm skin against the sting of heat, sun and pollution.
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-3 md:pt-5 mt-3 md:mt-5 border-t border-[#E6D5C1]/10">
                  {['Uvinul A Plus', 'Broad-spectrum SPF 40', 'Beta-Glucan', 'Bisabolol'].map((badge) => (
                    <span
                      key={badge}
                      className="text-[9.5px] sm:text-[10px] md:text-[11.5px] font-sans px-2.5 md:px-3.5 py-0.5 md:py-1 rounded-full bg-white/5 border border-[#E6D5C1]/15 text-[var(--brand-cream)]/90"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: The Gel */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-[#E6D5C1]/10 overflow-hidden flex flex-col justify-between">
              <div className="relative w-full h-[130px] sm:h-[180px] md:h-[270px] lg:h-[185px] xl:h-[210px] bg-[#4a3e2a] overflow-hidden">
                <Image
                  src={asset('/pdp/The gel, Aura new frame.jpeg')}
                  alt="Aura sunscreen gel texture, macro close-up"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover opacity-90"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2.5 left-3 text-[9px] uppercase tracking-[0.2em] font-medium text-[#E8DCC8]/60">
                </span>
              </div>

              <div className="p-4 sm:p-5 md:p-7 lg:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[12px] sm:text-[13px] md:text-[14px] font-suisse mb-0.5 md:mb-1">
                   THE GEL
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl md:text-[28px] text-[#E8DCC8] font-normal mb-1 md:mb-2 tracking-tight">
                    The skincare.
                  </h3>
                  <p className="font-sans text-xs sm:text-[12.5px] md:text-[14px] lg:text-[13px] leading-[1.45] md:leading-[1.55] text-[var(--brand-cream)]/85 font-light">
                    The gel is where the moisture and defence live: Ectoin one of skincare&rsquo;s most advanced protective actives, built to hold skin through heat, humidity and pollution &mdash; with Sodium Hyaluronate for deep, lasting hydration.
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-3 md:pt-5 mt-3 md:mt-5 border-t border-[#E6D5C1]/10">
                  {['Ectoin', 'Sodium Hyaluronate', '72-hour hydration'].map((badge) => (
                    <span
                      key={badge}
                      className="text-[9.5px] sm:text-[10px] md:text-[11.5px] font-sans px-2.5 md:px-3.5 py-0.5 md:py-1 rounded-full bg-white/5 border border-[#E6D5C1]/15 text-[var(--brand-cream)]/90"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}