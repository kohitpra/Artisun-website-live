'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { asset } from '@/lib/asset';
import CountUp from '@/components/origin/CountUp';

type Stat = {
  value: number;
  suffix: string;
  copy: string;
};

const STATS: Stat[] = [
  { value: 97, suffix: '%', copy: 'of UVB rays blocked' },
  { value: 40, suffix: '%', copy: 'less pollution-induced damage' },
  { value: 25, suffix: '%', copy: 'less skin sensitivity' },
  { value: 3, suffix: '×', copy: 'the moisture, from Ectoin' },
  { value: 8, suffix: ' hrs', copy: 'photostable protection' },
];

const BG_IMAGE = '/skinwear-media/worn-product.jpg';

export default function AuraStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: '-15%' });

  return (
    <div
      id="aura-stats"
      className="aura-panel relative w-screen shrink-0 h-[100svh] overflow-hidden text-[var(--brand-cream)] flex flex-col justify-between pt-[76px] pb-[68px] sm:pt-24 sm:pb-20 lg:py-0 px-4 sm:px-8 lg:px-16"
    >
      {/* Full-bleed background */}
      <Image
        src={asset(BG_IMAGE)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/50 to-black/80" />

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto h-full flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-14 my-auto">
        


        {/* TOP ON MOBILE / LEFT ON DESKTOP: Heading + Badges */}
        <div className="w-full lg:max-w-[500px] flex flex-col space-y-2 sm:space-y-4 lg:space-y-6 text-center lg:text-left shrink-0">
          <div>
            <span className="font-suisse text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[var(--brand-cream)]/70 font-medium">
              The Specifics
            </span>
            <h2 className="font-editorial text-[22px] sm:text-[34px] lg:text-[56px] leading-[1.08] tracking-tight mt-1 text-white">
              Backed by real numbers. Designed for real skin.
            </h2>
          </div>

          {/* 3 Badges under heading */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-2">
            <span className="font-suisse text-[9px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md text-white/90 shadow-sm">
              Broad spectrum
            </span>
            <span className="font-suisse text-[9px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md text-white/90 shadow-sm">
              All skin types
            </span>
            <span className="font-suisse text-[9px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md text-white/90 shadow-sm">
              Made in India
            </span>
          </div>
        </div>

       {/* BOTTOM ON MOBILE (Equal Uniform Cards) / RIGHT COLUMN ON DESKTOP */}
        <div
          ref={statsRef}
          className="w-full flex flex-wrap justify-center lg:flex-col gap-2 sm:gap-2.5 lg:gap-3 max-w-[380px] lg:min-w-[320px] shrink-0 mx-auto lg:mx-0"
        >
          {STATS.map((s, idx) => {
            return (
              <div
                key={idx}
                className="group flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left gap-1 sm:gap-1.5 lg:gap-3.5 w-[calc(33.33%-6px)] min-w-[95px] max-w-[115px] h-[78px] sm:h-[84px] lg:w-full lg:max-w-none lg:h-auto p-2 sm:p-2.5 lg:px-4 lg:py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 shrink-0"
              >
                {/* Stat Value */}
                <div className="font-editorial text-white text-[16px] sm:text-[18px] lg:text-[24px] leading-none tabular-nums font-medium shrink-0">
                  <CountUp end={s.value} suffix={s.suffix} play={inView} duration={1.8} />
                </div>

                {/* Stat Copy */}
                <p className="font-suisse text-[8.5px] sm:text-[9.5px] lg:text-[12px] leading-tight text-white/85 flex-1 line-clamp-2">
                  {s.copy}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}