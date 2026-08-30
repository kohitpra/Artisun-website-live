'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { asset } from '@/lib/asset';
import CountUp from './CountUp';

type Stat = { index: string; label: string; value: number; suffix: string; copy: string; mobileCopy: string };

const STATS: Stat[] = [
  { index: '01', label: 'Serum', value: 20, suffix: '%', copy: "deeper hydration than hyaluronic acid — the Beta-Glucan that does a serum's barrier work.", mobileCopy: 'deeper hydration than hyaluronic acid' },
  { index: '02', label: 'Moisturiser', value: 72, suffix: ' hrs', copy: 'of continuous moisture — hydration that holds, long after it goes on.', mobileCopy: 'of continuous moisture' },
  { index: '03', label: 'Sunscreen', value: 98, suffix: '%', copy: 'of UVB blocked — a full SPF 50+ PA++++ shield, tested to protect.', mobileCopy: 'of UVB blocked' },
  { index: '04', label: 'Primer', value: 0, suffix: '', copy: 'pilling or slide — a smooth, even base makeup grips to.', mobileCopy: 'pilling or slide' },
  { index: '05', label: 'Over time', value: 4, suffix: ' weeks', copy: 'to a visibly stronger skin barrier, used daily.', mobileCopy: 'to a visibly stronger skin barrier, used daily.' },
];

const BG_IMAGE_DESKTOP = '/pdp/origin-why-desktop.webp';
const BG_IMAGE_MOBILE = '/pdp/origin-why-mobile.webp';

export default function OriginWhy() {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: '-15%' });

  return (
    <div id="origin-why" className="origin-panel relative w-screen shrink-0 h-[100svh] overflow-hidden">
      {/* Full-bleed background — shown AS IS. Both scrims are gone: the
          `bg-black/55` wash and the top/bottom gradient. Legibility now comes
          from the frosted panels on the copy and stat boxes instead, so the
          photograph itself stays clean. */}
      <Image
        src={asset(BG_IMAGE_MOBILE)}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover object-center lg:hidden"
      />
      <Image
        src={asset(BG_IMAGE_DESKTOP)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center hidden lg:block"
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-14 pt-20 pb-24 sm:pt-24 sm:pb-24 lg:pt-[104px] lg:pb-16 flex flex-col justify-between overflow-hidden">
        {/* Top: Center on mobile, 2-col on desktop */}
        {/* Type sizes on mobile now match frame 3 (OriginWhere): 30px heading,
            15px body — they were 22px/11px, noticeably smaller than every
            neighbouring panel. */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 shrink-0 mt-2 sm:mt-4 lg:mt-0">
          {/* 2 Lines on mobile */}
          <h2 className="font-editorial text-[var(--brand-cream)] text-[28px] sm:text-[44px] lg:text-[54px] leading-[1.08] tracking-tight text-center lg:text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
            The most boring step in your<br className="lg:hidden" /> morning finally worth it
          </h2>
          
          {/* Mobile Description with large top spacing */}
          <p className="font-suisse text-[var(--brand-cream)]/90 text-[17.5px] sm:text-[15px] leading-[1.4] text-center max-w-[34ch] mt-[15svh] mb-3 lg:hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Four layers before your morning chai? Origin makes it one. So your morning is faster, no heaviness, no pilling & no greasiness.
          </p>

          {/* Desktop Description (Untouched) */}
          <p className="hidden lg:block font-suisse text-[var(--brand-cream)]/85 text-[19px] leading-[1.5] max-w-[48ch] pt-2 justify-self-end drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            Nobody misses layering four things before they’ve even had their chai. Origin is one light layer that sorts your skin for the day - so your morning is faster, with no heaviness, no pilling by noon & no greasiness.
          </p>
        </div>

        <div
          ref={statsRef}
          className="w-full grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 max-w-[340px] sm:max-w-[420px] lg:max-w-none mx-auto shrink-0 mb-auto lg:mb-0 pb-3 lg:pb-0"
        >
          {STATS.map((s, idx) => {
            const isLastOne = idx === 4;
            return (
              <div
                key={s.index}
                className={`${isLastOne ? 'col-span-2 justify-self-center w-[52%] lg:w-full lg:col-span-1' : 'w-full'} min-h-[82px] sm:min-h-[92px] lg:min-h-[175px] p-2.5 sm:p-3 lg:p-4 rounded-xl bg-gradient-to-b from-[#6e140d]/75 to-[#380805]/90 backdrop-blur-md border border-white/20 lg:border-white/15 flex flex-col justify-between shadow-lg hover:border-white/30 transition-all`}
              >
                <div>
                  <div className="font-suisse text-[8.5px] sm:text-[9.5px] lg:text-[11px] tracking-[0.12em] uppercase text-[var(--brand-cream)]/60">
                    {s.index} · {s.label}
                  </div>
                  <div className="font-editorial text-[var(--brand-cream)] text-[21px] sm:text-[22px] lg:text-[60px] leading-none mt-1 lg:mt-2 tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                    <CountUp end={s.value} suffix={s.suffix} play={inView} duration={2} />
                  </div>
                </div>

                <p className="font-suisse text-[11px] sm:text-[9.5px] lg:text-[13.5px] leading-[1.2] lg:leading-[1.45] text-[var(--brand-cream)]/90 lg:text-white mt-1 lg:mt-2 line-clamp-2 lg:line-clamp-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  <span className="lg:hidden">{s.mobileCopy}</span>
                  <span className="hidden lg:inline">{s.copy}</span>
                </p>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}