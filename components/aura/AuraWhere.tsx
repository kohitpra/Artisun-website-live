'use client';

import Image from '@/components/media/SizedImage';
import { asset } from '@/lib/asset';

type Weather = {
  index: string;
  title: string;
  copy: string;
  desktopImage: string;
  mobileImage: string;
};

const WEATHER: Weather[] = [
  {
    index: '01',
    title: 'Every region',
    copy: "From Chennai's coast to Manali's cold. From Ahmedabad's dry heat to Kolkata's damp. Wherever you are, it holds.",
    desktopImage: '/girls standing 1080x1080 (1).png',
    mobileImage: '/popup/GIRL STANDING.png',
  },
  {
    index: '02',
    title: 'Every season',
    copy: 'Peak summer heat. Sticky monsoon air. Dry winter cold. Polluted city evenings — it holds through all of them.',
    desktopImage: '/aura 1080x1080 (1).png',
    mobileImage: '/popup/Artboard 1 copy.png',
  },
  {
    index: '03',
    title: 'Every skin type',
    copy: 'Oily, dry, combination or sensitive. Every skin type — in just the right amount for the day. Built for your weather, not just your skin type.',
    desktopImage: '/skinwear-media/girl standing 1080x1080.png',
    mobileImage: '/popup/Artboard 1 copy 2.png',
  },
];

export default function AuraWhere() {
  return (
    <div
      id="aura-where"
      className="aura-panel relative w-screen shrink-0 h-[100svh] scroll-mt-[72px] lg:scroll-mt-0 flex flex-col overflow-hidden text-[var(--brand-cream)]"
      style={{ background: 'var(--bg-eclipse)' }}
    >
      {/* Heading block */}
      <div className="px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 md:pt-12 lg:pt-[112px] pb-2 md:pb-4 lg:pb-8 max-w-[1500px] w-full mx-auto">
        <span className="font-suisse text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--brand-cream)]/70">
          Where it works
        </span>
        <h2 className="font-editorial text-[30px] sm:text-[46px] md:text-[38px] lg:text-[58px] leading-[1.08] lg:leading-[1.03] tracking-tight not-italic mt-1.5">
          Works in every Indian weather. Actually.
        </h2>
      </div>

      {/* Cards — 3 columns edge-to-edge (desktop & tablet) / swipe strip (mobile) */}
      <div className="ow-strip flex-1 flex gap-[10px] px-0 lg:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none">
        {WEATHER.map((w) => (
          <article
            key={w.index}
            className="ow-card group relative shrink-0 basis-[82%] sm:basis-[60%] md:basis-0 md:flex-1 snap-center overflow-hidden"
          >
            {/* Mobile Image */}
            <Image
              src={asset(w.mobileImage)}
              alt={w.title}
              fill
              sizes="82vw"
              className="ow-img object-cover md:hidden transition-[transform,filter] duration-700 ease-out"
            />

            {/* Desktop Image */}
            <Image
              src={asset(w.desktopImage)}
              alt={w.title}
              fill
              sizes="(max-width: 768px) 82vw, 33vw"
              className="ow-img object-cover hidden md:block transition-[transform,filter] duration-700 ease-out"
            />

            {/* Darkening gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="ow-veil absolute inset-0 bg-black/0 transition-colors duration-[600ms]" />

            {/* Index top-left */}
            <span className="absolute top-4 md:top-5 left-4 md:left-5 font-suisse text-xs tracking-[0.14em] text-[var(--brand-cream)]/70">
              {w.index}
            </span>

            {/* Bottom-anchored text */}
            <div className="absolute left-4 md:left-6 right-4 md:right-6 bottom-14 md:bottom-16">
              <h3 className="font-editorial text-[var(--brand-cream)] text-[26px] sm:text-[30px] md:text-[24px] lg:text-[34px] leading-tight">
                {w.title}
              </h3>

              <div className="ow-desc grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out">
                <div className="overflow-hidden">
                  <p className="font-suisse text-[14px] sm:text-[15px] md:text-[12.5px] lg:text-[15px] leading-[1.5] text-[var(--brand-cream)]/95 pt-2 md:pt-3 max-w-[38ch]">
                    {w.copy}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

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