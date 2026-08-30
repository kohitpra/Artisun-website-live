'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const headline = "The future of Climate-smart Skinwear starts here.";
const subline = "A new standard in sun protection. For every climate. For every day.";

export default function CTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const sublineWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  headlineWordsRef.current = [];
  sublineWordsRef.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ── ENTRY: Diagonal Wipe — applied to the content wrapper only, never
      // the section itself, so the background gradient stays fully painted
      // and flows continuously into the section before/after it instead of
      // clipping away to reveal the page's raw background underneath. ──
      gsap.set(contentWrapRef.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'top 20%',
        scrub: true,
        animation: gsap.to(contentWrapRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ease: 'power2.out',
        }),
      });

      // Line grows from center
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 55%' } }
        );
      }

      // Word-by-word headline with blur
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'top 10%',
        scrub: 1.5,
        animation: gsap.to(headlineWordsRef.current, {
          opacity: 1, filter: 'blur(0px)', y: 0,
          stagger: 0.08, ease: 'none',
        }),
      });

      // Subline reveal
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 35%',
        end: 'top 5%',
        scrub: 1.5,
        animation: gsap.to(sublineWordsRef.current, {
          opacity: 1, filter: 'blur(0px)',
          stagger: 0.08, ease: 'none',
        }),
      });

      // Button
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { y: 30, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 25%' } }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden z-10"
      style={{
        background:
          'linear-gradient(180deg, #F2812E 0%, #E8651C 18%, #C13A16 40%, #8F1F10 62%, #6B2311 82%, #56190C 100%)',
      }}
    >
      {/* Ambient glow + slow flowing light sweep — same moving highlight used
          on the global background, so this section reads as a continuation
          of one living gradient rather than a static block. */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255,210,150,0.18) 0%, transparent 65%)',
      }} />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          left: '-10vw',
          width: '120vw',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,150,60,0.10), transparent 60%)',
          mixBlendMode: 'screen',
          animation: 'moveLightX 25s ease-in-out infinite',
        }}
      />

      <div ref={contentWrapRef} className="relative z-10 flex flex-col items-center justify-center min-h-[85svh] px-8 md:px-16">
        <div
          ref={lineRef}
          className="w-16 h-[1px] mb-10 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, #e8dfc5, transparent)', willChange: 'transform, opacity' }}
        />

        <h3 className="font-suisse text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#e8dfc5]/40 mb-12 font-medium">
          The Future
        </h3>

        <h1 className="font-editorial text-[#e8dfc5] text-[26px] md:text-[38px] lg:text-[50px] leading-[1.1] text-center max-w-4xl mb-10 tracking-tight flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.1em]">
          {headline.split(" ").map((word, i) => (
            <span key={`fh-${i}`} ref={el => { if (el) headlineWordsRef.current.push(el); }}
              className="opacity-[0.1]"
              style={{ filter: 'blur(6px)', transform: 'translateY(8px)', willChange: 'opacity, filter, transform' }}>
              {word}
            </span>
          ))}
        </h1>

        <p className="font-editorial italic text-[#e8dfc5]/60 text-[26px] md:text-[38px] lg:text-[50px] leading-[1.1] text-center max-w-4xl mb-20 font-light flex flex-wrap justify-center gap-x-[0.2em] gap-y-[0.1em]">
          {subline.split(" ").map((word, i) => (
            <span key={`fs-${i}`} ref={el => { if (el) sublineWordsRef.current.push(el); }}
              className="opacity-[0.1]"
              style={{ filter: 'blur(4px)', willChange: 'opacity, filter' }}>
              {word}
            </span>
          ))}
        </p>

        <div ref={buttonRef} style={{ willChange: 'transform, opacity, filter' }}>
          <button className="group relative px-12 py-5 rounded-full flex items-center gap-4 cursor-pointer overflow-hidden transition-all duration-700 border border-[#e8dfc5]/15 hover:border-[#e8dfc5]/40 backdrop-blur-md">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(232,223,197,0.08) 45%, rgba(232,223,197,0.15) 50%, rgba(232,223,197,0.08) 55%, transparent 80%)',
            }} />
            <span className="font-suisse text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#e8dfc5]/80 group-hover:text-[#e8dfc5] transition-colors duration-500 z-10">
              Enter the world of Artisun
            </span>
            <span className="text-[#e8dfc5]/50 group-hover:text-[#e8dfc5] transition-all duration-500 transform group-hover:translate-x-1.5 z-10 text-sm">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
