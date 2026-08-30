'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TextRevealSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.reveal-word');
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: isMobile ? 'top 85%' : 'top top',
          end: isMobile ? 'top 25%' : '+=100%',
          pin: !isMobile,
          anticipatePin: isMobile ? 0 : 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        words,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: isMobile ? 0.04 : 0.12,
          ease: 'none',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const line1 = ['Because', 'your', 'city', 'decides', 'what'];
  const line2 = ['kind', 'of', 'day', 'your', 'skin', 'gets.'];

  return (
    <section
      ref={containerRef}
      className="relative w-full z-10 flex items-center justify-center select-none overflow-hidden py-8 xs:py-10 sm:py-20 md:py-0 md:h-[100svh] px-3 sm:px-6 md:px-18"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {/* 2-Line Locked Editorial Typography */}
      <div className="w-full max-w-[1280px] mx-auto text-center flex flex-col items-center justify-center font-editorial font-normal text-[clamp(25px,5.12vw,68px)] leading-[1.12] tracking-tight text-[var(--brand-cream,#f5f0eb)]">

        {/* Line 1: Locked single line on mobile */}
        <div className="flex flex-nowrap justify-center items-center gap-x-[0.22em] whitespace-nowrap">
          {line1.map((word, idx) => (
            <span
              key={`l1-${idx}`}
              className="reveal-word opacity-25 inline-block will-change-[opacity]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Line 2: Locked second line */}
        <div className="flex flex-nowrap justify-center items-center gap-x-[0.22em] whitespace-nowrap mt-1 xs:mt-1.5 sm:mt-2">
          {line2.map((word, idx) => (
            <span
              key={`l2-${idx}`}
              className="reveal-word opacity-25 inline-block will-change-[opacity]"
            >
              {word}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}