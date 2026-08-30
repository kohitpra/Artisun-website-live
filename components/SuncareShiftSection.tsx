'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const line1 = "This shift does more than change";
const line2 = "how protection is created.";
const line3 = "It redefines how it is worn.";

export default function SuncareShiftSection() {
  const containerRef = useRef<HTMLElement>(null);
  const sharpBgRef = useRef<HTMLDivElement>(null);

  const words1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const words2Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const words3Ref = useRef<(HTMLSpanElement | null)[]>([]);

  words1Ref.current = [];
  words2Ref.current = [];
  words3Ref.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // ── ENTRY: Circle Iris Bloom — expands from center outward ──
    gsap.set(containerRef.current, { clipPath: 'circle(0% at 50% 50%)' });
    triggers.push(ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 90%',
      end: 'top top',
      scrub: true,
      animation: gsap.to(containerRef.current, {
        clipPath: 'circle(75% at 50% 50%)',
        ease: 'power2.out',
      }),
    }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      }
    });

    // ── REVEAL: every word lights up one-by-one across the whole pinned
    // scroll (all three lines in reading order), and the sharp background
    // image emerges over the SAME span — so the photo fades in gradually,
    // word by word, instead of swapping in as one jump after a line. Both
    // tweens sit at the "reveal" label so they advance in lockstep. ──
    const allWords = [
      ...words1Ref.current,
      ...words2Ref.current,
      ...words3Ref.current,
    ];

    const WORD_STAGGER = 0.12;
    const WORD_DURATION = 0.5;
    // Total time the staggered word reveal occupies: the last word starts at
    // (N-1)*stagger and then plays for WORD_DURATION. Matching the image tween
    // to this makes the photo finish emerging exactly as the last word lands.
    const revealSpan = (allWords.length - 1) * WORD_STAGGER + WORD_DURATION;

    tl.to(allWords, {
      opacity: 1,
      stagger: WORD_STAGGER,
      duration: WORD_DURATION,
      ease: "none",
    }, "reveal");

    tl.to(sharpBgRef.current, {
      opacity: 1,
      duration: revealSpan,
      ease: "none",
    }, "reveal");

    tl.to({}, { duration: 0.8 });

    // ── EXIT: Content dissolves — the next section reveals over the shared
    // global gradient, so no bridging overlay box is needed. ──
    tl.addLabel('exit');
    tl.to(
      allWords,
      { opacity: 0, duration: 0.8, ease: 'power2.in' },
      'exit'
    );

    triggers.push(tl.scrollTrigger!);

    return () => {
      triggers.forEach(st => st.kill());
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] bg-transparent z-10 flex flex-col items-center justify-center px-6 md:px-20 lg:px-32 overflow-hidden">

      {/* Background Image Layer 1: Blurred */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/a-new-language-of-suncare.png')}
          alt="A New Language of Suncare Blurred"
          className="w-full h-full object-cover scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Background Image Layer 2: Sharp (Starts Hidden) */}
      <div ref={sharpBgRef} className="absolute inset-0 z-[1] opacity-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/a-new-language-of-suncare-2.webp')}
          alt="A New Language of Suncare Sharp"
          className="w-full h-full object-cover scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Foreground Text */}
      <div className="relative z-10 w-fit mx-auto text-left font-editorial font-normal text-[26px] md:text-[38px] lg:text-[50px] leading-[1.2] tracking-wide text-white">

        {/* Line 1 */}
        <div className="mb-[0.2em] flex flex-wrap justify-start gap-x-[0.25em] gap-y-[0.15em] w-full">
          {line1.split(" ").map((word, wordIndex) => (
            <span
              key={`l1-${wordIndex}`}
              ref={el => { if (el) words1Ref.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Line 2 */}
        <div className="mb-[0.2em] flex flex-wrap justify-start gap-x-[0.25em] gap-y-[0.15em] w-full">
          {line2.split(" ").map((word, wordIndex) => (
            <span
              key={`l2-${wordIndex}`}
              ref={el => { if (el) words2Ref.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Line 3 */}
        <div className="flex flex-wrap justify-start gap-x-[0.25em] gap-y-[0.15em] w-full">
          {line3.split(" ").map((word, wordIndex) => (
            <span
              key={`l3-${wordIndex}`}
              ref={el => { if (el) words3Ref.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>

      </div>

    </section>
  );
}
