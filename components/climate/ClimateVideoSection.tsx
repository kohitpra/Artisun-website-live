'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  {
    city: 'Shimla',
    condition: 'Dry cold',
    image: asset('/climate-weather/shimla.webp'),
    heading: 'A Shimla winter',
    desc: 'pulls all the moisture out, and by afternoon your skin’s tight and flaking.',
  },
  {
    city: 'Jaipur',
    condition: 'Dry heat',
    image: asset('/climate-weather/jaipur.webp'),
    heading: 'In the Jaipur heat,',
    desc: 'whatever you put on is gone before noon.',
  },
  {
    city: 'Bangalore',
    condition: 'Humid',
    image: asset('/climate-weather/bangalore.webp'),
    heading: 'Bangalore’s humidity',
    desc: 'leaves everything sitting greasy, pilling the moment you touch makeup.',
  },
  {
    city: 'Bombay',
    condition: 'Monsoon',
    image: asset('/climate-weather/bombay.webp'),
    heading: 'And in Bombay,',
    desc: 'all it takes is one downpour, and your face is an oily mess.',
  },
];

const N = CARDS.length;

// ── Text-swap animation, ported from climate-transition.html ──
// The source file's mechanic: on a city change the copy fades to 0, sits blank
// for SWAP_MS, then fades back in — the heading over CITY_MS and the body over
// BODY_MS. The two durations differ on purpose; the stagger is what makes the
// line feel like it's being *replaced* rather than cross-dissolved.
const SWAP_MS = 180;
const CITY_MS = 500;
const BODY_MS = 700;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// Opacity interpolation across scroll progress
const BAND = 0.55;
function cityOpacity(i: number, u: number) {
  const rise = i === 0 ? 1 : smoothstep(i - BAND / 2, i + BAND / 2, u);
  const fall = i === N - 1 ? 1 : 1 - smoothstep(i + 1 - BAND / 2, i + 1 + BAND / 2, u);
  return Math.min(rise, fall);
}

export default function ClimateVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // `active` is the card the scroll position currently sits on. `shown` lags it
  // by SWAP_MS — that gap is the blank beat from the source file.
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Initial state setup
      imageRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
      fillRefs.current.forEach((el) => el && gsap.set(el, { scaleX: 0 }));

      const render = (progress: number) => {
        const u = progress * N;

        // Which card the scroll is sitting on. setActive is a no-op when the
        // value is unchanged, so this is safe to call every frame.
        setActive(Math.min(N - 1, Math.floor(u)));

        for (let i = 0; i < N; i++) {
          const op = cityOpacity(i, u);

          const img = imageRefs.current[i];
          if (img) img.style.opacity = String(op);


          const fill = fillRefs.current[i];
          if (fill) fill.style.transform = `scaleX(${clamp(u - i, 0, 1)})`;
        }
      };

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * N * 0.9,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });

      render(0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── The swap itself (climate-transition.html mechanic) ──
  // `shown` trails `active`: fade out → hold blank for SWAP_MS → swap the copy →
  // fade back in. Doing it with a lagging index rather than animating the same
  // node keeps React's render and the animation in step; animating text content
  // directly would show the new string during the fade-out frame.
  useEffect(() => {
    if (active === shown) return;
    setVisible(false);
    const t = setTimeout(() => {
      setShown(active);
      setVisible(true);
    }, SWAP_MS);
    return () => clearTimeout(t);
  }, [active, shown]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full z-20"
      style={{
        background:
          'var(--bg-eclipse)',
      }}
    >
      <div
        ref={pinRef}
        className="relative w-full h-[100svh] min-h-[620px] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* ── TOP (80%) on Mobile & Tablets / LEFT (66%) on Laptop ── */}
        <div className="relative w-full h-[80svh] lg:h-full lg:w-2/3 overflow-hidden bg-transparent">
          {CARDS.map((card, i) => (
            <div
              key={card.city}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="absolute inset-0 w-full h-full will-change-[opacity]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={`${card.city} — ${card.condition}`}
                className="absolute inset-0 w-full h-full object-cover object-center lg:object-[50%_48%]"
                draggable={false}
              />
            </div>
          ))}

          {/* Seam softeners: Kept exclusively for Desktop */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{ background: 'linear-gradient(90deg, transparent 78%, rgba(11,6,5,0.55) 100%)' }}
          />
        </div>

        {/* ── BOTTOM (20%) on Mobile & Tablets / RIGHT (33%) on Laptop ── */}
        <div className="relative w-full h-[20svh] lg:h-full lg:w-1/3 bg-transparent flex flex-col justify-between">
          <div className="relative h-full w-full">
            {/* One panel. The copy is swapped underneath a fade rather than
                cross-dissolving four stacked absolute layers — that is what the
                source HTML does, and it reads as a deliberate replacement. */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center lg:items-start lg:text-left px-4 sm:px-8 lg:px-12 xl:px-16 pt-0.5 lg:pt-0 pb-6 sm:pb-8 lg:pb-20">
              {/* Heading — fades over CITY_MS */}
              <h3
                className="w-full font-editorial text-[var(--brand-cream)] text-[24px] xs:text-[27px] sm:text-[32px] lg:text-[42px] xl:text-[46px] leading-[1.04] tracking-tight mb-1 lg:mb-4 drop-shadow-sm will-change-[opacity]"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity ${CITY_MS}ms ease`,
                }}
              >
                {CARDS[shown].heading}
              </h3>

              {/* Body — fades over BODY_MS, deliberately slower than the heading */}
              <p
                className="font-suisse text-[var(--brand-cream)]/90 text-[13px] xs:text-[14.5px] sm:text-[16px] lg:text-[22px] leading-[1.28] lg:leading-[1.5] max-w-[320px] xs:max-w-[360px] sm:max-w-[460px] lg:max-w-[28ch] drop-shadow-sm will-change-[opacity]"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity ${BODY_MS}ms ease`,
                }}
              >
                {CARDS[shown].desc}
              </p>
            </div>
          </div>

          {/* Segmented Progress Bar: Grounded on Mobile */}
          <div className="absolute bottom-2 xs:bottom-2.5 sm:bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-12 xl:left-16 w-[88vw] max-w-[320px] sm:max-w-[440px] lg:w-auto lg:max-w-none lg:right-12 xl:right-16 z-30">
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-2">
              {CARDS.map((card, i) => (
                <div
                  key={card.city}
                  className="relative h-[2px] sm:h-[3px] flex-1 rounded-full bg-[var(--brand-cream)]/25 overflow-hidden"
                >
                  <span
                    ref={(el) => {
                      fillRefs.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left rounded-full bg-[var(--brand-cream)]"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}