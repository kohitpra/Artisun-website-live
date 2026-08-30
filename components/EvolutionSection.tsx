'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const line1 = "Suncare needed to evolve";
const line2 = "and Artisun begins with this understanding.";

export default function EvolutionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const warmBreathRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const words1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const words2Ref = useRef<(HTMLSpanElement | null)[]>([]);
  words1Ref.current = [];
  words2Ref.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── ENTRY: Curtain Reveal from behind ClimateSection ──
    // EvolutionSection starts physically shifted up behind ClimateVideoSection (-100%).
    // As Climate scrolls up naturally, we animate Evolution's Y offset to 0.
    // This cancels out the native scroll, making Evolution appear completely
    // stationary while Climate slides off it vertically like a curtain lifting.
    const entrySt = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      animation: gsap.fromTo(innerRef.current, 
        { yPercent: -100 },
        { yPercent: 0, ease: 'none' }
      ),
    });

    // ── Pinned + scroll-scrubbed reveal ──
    // The whole beat sequence is tied to scroll progress through the pin (scrub),
    // not real-world time. Previously this ran on toggleActions: 'play' — a fixed
    // wall-clock animation that could finish revealing/exiting well before or after
    // the user actually scrolled through the pinned region, leaving a blank
    // crimson or cream screen for the rest of the scroll. Scrubbing keeps every
    // beat locked to exactly where the user is in the pin.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
      start: 'top top',
      end: '+=70%',
      pin: true,
      anticipatePin: 1,
      scrub: 1,
    },
      defaults: { ease: 'power4.out' }
    });

    // Removed the pinSpacer background override and crimson overlay to let
    // the global molten core background shine through seamlessly.

    // Beat 1 — Removed monogram animation, it stays static now.

    // Beat 2 — Line 1 words highlight one by one
    tl.to(words1Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    }, 0.4);

    // Beat 3 — Line 2 words highlight one by one
    tl.to(words2Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    }, 0.95);

    // ── EXIT SEQUENCE ──
    // Text fades out
    tl.to(
      [...words1Ref.current, ...words2Ref.current],
      { opacity: 0, duration: 1.0, ease: 'power3.in' },
      'exit'
    );
    tl.to(monogramRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
    }, 'exit');

    return () => {
      entrySt.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] bg-transparent z-10"
    >
      <div ref={innerRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-20 w-full h-full overflow-hidden">

      <div
        ref={monogramRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-[1]"
        style={{ 
          opacity: 0.40, 
          willChange: 'opacity',
          mixBlendMode: 'overlay',
          width: 'clamp(180px, 35vw, 500px)',
          height: 'clamp(180px, 35vw, 500px)'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/logo-artisun.svg')}
          alt="Artisun Monogram"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Foreground Text */}
      <div className="relative z-10 w-full max-w-[90vw] md:max-w-[800px] lg:max-w-[1200px] mx-auto text-center font-editorial font-normal text-[26px] md:text-[38px] lg:text-[50px] leading-[1.1] tracking-[-0.02em] text-white">

        {/* Line 1 */}
        <div
          ref={line1Ref}
          className="mb-[0.2em] flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em] w-full"
        >
          {line1.split(" ").map((word, i) => (
            <span
              key={`l1-${i}`}
              ref={el => { if (el) words1Ref.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Line 2 */}
        <div
          ref={line2Ref}
          className="flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em] w-full"
        >
          {line2.split(" ").map((word, i) => (
            <span
              key={`l2-${i}`}
              ref={el => { if (el) words2Ref.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>

      </div>

      </div>
    </section>
  );
}
