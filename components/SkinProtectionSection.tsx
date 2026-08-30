'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const line1 = "Skin protection should exist in multiple";
const line2 = "forms that fit seamlessly into daily living.";

export default function SkinProtectionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  const words1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const words2Ref = useRef<(HTMLSpanElement | null)[]>([]);

  words1Ref.current = [];
  words2Ref.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(bgRef.current, { scale: 1.08 });

    const triggers: ScrollTrigger[] = [];

    // ── ENTRY: Left Wipe — sweeps in UNDERNEATH ClothingSection's exit ──
    // This section is pulled up -100svh (see className), so its top reaches the
    // viewport top exactly when Clothing's pin releases. Clothing paints above
    // (z-20 vs z-10) with a fully opaque background, so the wipe below stays
    // hidden until Clothing's exit dissolve begins (~73% through its pin) — then
    // the cloth melts away and this section is revealed mid-wipe beneath it.
    // 'top 45%' times the wipe to start right as that dissolve kicks in and to
    // complete exactly at the pin hand-off. No empty-gradient gap in between.
    gsap.set(containerRef.current, { clipPath: 'inset(0% 100% 0% 0%)' });
    triggers.push(ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 45%',
      end: 'top top',
      scrub: true,
      animation: gsap.to(containerRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power2.out',
      }),
    }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=180%",
        pin: true,
        anticipatePin: 1,
        scrub: 1.5,
      }
    });

    tl.to(bgRef.current, {
      filter: "blur(0px)",
      scale: 1.0,
      duration: 1,
      ease: "power2.out"
    }, 0);

    tl.to(words1Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    }, 0);

    tl.to(words2Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    }, 0.2);

    tl.to({}, { duration: 0.5 });

    // ── EXIT: Content dissolves, dark overlay fades in ──
    tl.addLabel('exit');
    tl.to(
      [...words1Ref.current, ...words2Ref.current],
      { opacity: 0, duration: 0.6, ease: 'power2.in' },
      'exit'
    );
    tl.to(bgRef.current, {
      filter: 'blur(8px)',
      scale: 1.04,
      duration: 0.8,
      ease: 'power2.in',
    }, 'exit');
    tl.to(bgLayerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 'exit');

    triggers.push(tl.scrollTrigger!);

    return () => {
      triggers.forEach(st => st.kill());
      tl.kill();
    };
  }, []);

  return (
    // -mt-[100svh]: underlaps the tail of ClothingSection's pinned range so this
    // section is already fullscreen (beneath the dissolving cloth, z-10 < z-20)
    // the moment Clothing unpins — removing the empty-gradient gap between them.
    <section ref={containerRef} className="relative w-full h-[100svh] bg-transparent z-10 -mt-[100svh] flex flex-col items-center justify-center px-6 md:px-20 lg:px-32 overflow-hidden">

      {/* Background Image Layer */}
      <div ref={bgLayerRef} className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bgRef}
          src={asset('/a-new-language-of-suncare-3.webp')}
          alt="Model side profile"
          className="w-full h-full object-cover blur-[16px]"
          style={{ willChange: 'transform, filter' }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
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
        <div className="flex flex-wrap justify-start gap-x-[0.25em] gap-y-[0.15em] w-full">
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

      </div>

    </section>
  );
}
