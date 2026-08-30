'use client';
import Image from 'next/image';
import { asset } from '@/lib/asset';
type Weather = { index: string; title: string; copy: string; image: string };
const WEATHER: Weather[] = [
  {
    index: '01',
    title: 'Every season',
    copy: 'Dry summers and humid days. Polluted evenings and sticky monsoons. Diwali smog and December fog.',
    image: '/pdp/origin-season.webp',
  },
  {
    index: '02',
    title: 'Every region',
    copy: 'From busy Indian cities to quiet hill stations. From hot coasts to dry plains. From the city you live in to the beach you escape to.',
    image: '/pdp/origin-region.webp',
  },
  {
    index: '03',
    title: 'Every skin',
    copy: 'Oily, dry, combination or sensitive. One formula that works across all of them — no sorting, no second bottle.',
    image: '/pdp/origin-skin.webp',
  },
];
export default function OriginWhere() {
  return (
    <div
      id="origin-where"
      className="origin-panel relative w-screen shrink-0 h-[100svh] flex flex-col"
    >
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {/* Heading block */}
      <div className="px-5 sm:px-8 lg:px-14 pt-24 lg:pt-[112px] pb-6 lg:pb-8 max-w-[1500px] w-full mx-auto">
        <h2 className="font-editorial text-[var(--brand-cream)] text-[30px] sm:text-[46px] lg:text-[58px] leading-[1.03] tracking-tight not-italic">
          One sunscreen. Every Indian weather.
        </h2>
        <p className="font-suisse text-[var(--brand-cream)]/60 text-[15px] sm:text-[18px] mt-3">
          Built for your weather, not just your skin type.
        </p>
      </div>
      {/* Cards — 3 columns edge-to-edge (desktop) / swipe strip (mobile) */}
      <div className="ow-strip flex-1 flex gap-[10px] px-0 lg:px-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none">
        {WEATHER.map((w) => (
          <article
            key={w.index}
            className="ow-card group relative shrink-0 basis-[82%] sm:basis-[60%] lg:basis-0 lg:flex-1 snap-center overflow-hidden"
          >
            <Image
              src={asset(w.image)}
              alt={w.title}
              fill
              sizes="(max-width: 1024px) 82vw, 33vw"
              className="ow-img object-cover transition-[transform,filter] duration-700 ease-out"
            />
            {/* darkening gradient for baseline legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            {/* hover veil — darkens the whole card so revealed copy is fully readable */}
            <div className="ow-veil absolute inset-0 bg-black/0 transition-colors duration-[600ms]" />
            {/* index top-left */}
            <span className="absolute top-5 left-5 font-suisse text-xs tracking-[0.14em] text-[var(--brand-cream)]/70">
              {w.index}
            </span>
            {/* bottom-anchored text — title rises as copy expands */}
            <div className="absolute left-6 right-6 bottom-16 sm:bottom-16 lg:bottom-16">
              <h3 className="font-editorial text-[var(--brand-cream)] text-[26px] sm:text-[30px] lg:text-[34px] leading-tight">
                {w.title}
              </h3>
              <div className="ow-desc grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out">
                <div className="overflow-hidden">
                  <p className="font-suisse text-[14px] sm:text-[15px] leading-[1.55] text-[var(--brand-cream)]/95 pt-3 max-w-[38ch]">
                    {w.copy}
                  </p>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
      {/*
        Hover-capable devices: blur+scale the image, expand the copy, hide the hint.
        Touch devices (no hover): copy stays open, hint hidden — nothing to reveal.
      */}
      <style jsx>{`
        @media (hover: hover) {
         .ow-card:hover .ow-img {
            filter: blur(8px) brightness(0.4);
            transform: scale(1.06);
          }
         .ow-card:hover .ow-veil {
            background: rgba(0, 0, 0, 0.5);
          }
         .ow-card:hover .ow-desc {
            grid-template-rows: 1fr;
          }
        }
        @media (hover: none) {
         .ow-img {
            filter: brightness(0.55);
          }
         .ow-veil {
            background: rgba(0, 0, 0, 0.42);
          }
         .ow-desc {
            grid-template-rows: 1fr;
          }
        }
       .ow-strip::-webkit-scrollbar {
          display: none;
        }
       .ow-strip {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}