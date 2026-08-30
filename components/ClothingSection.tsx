'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const line1 = "Just as clothing changes with";
const line2 = "occasions and environments,";

export default function ClothingSection() {
  const containerRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  const words1Ref = useRef<(HTMLSpanElement | null)[]>([]);
  const words2Ref = useRef<(HTMLSpanElement | null)[]>([]);

  words1Ref.current = [];
  words2Ref.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // ── ENTRY: Cinema Card — rounded card opens with depth ──
    gsap.set(containerRef.current, { clipPath: 'inset(12% round 32px)' });
    triggers.push(ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 90%',
      end: 'top top',
      scrub: true,
      animation: gsap.to(containerRef.current, {
        clipPath: 'inset(0% round 0px)',
        ease: 'power3.out',
      }),
    }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=140%",
        pin: true,
        anticipatePin: 1,
        scrub: 1.5,
      }
    });

    tl.to(words1Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    });

    tl.to(words2Ref.current, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    }, "+=0.1");

    tl.to({}, { duration: 0.5 });

    // ── EXIT: Content dissolves — the next section reveals over the shared
    // global gradient, so no bridging overlay box is needed. ──
    tl.addLabel('exit');
    tl.to(
      [...words1Ref.current, ...words2Ref.current],
      { opacity: 0, duration: 0.6, ease: 'power2.in' },
      'exit'
    );
    tl.to(
      bgLayerRef.current,
      { opacity: 0, duration: 0.8, ease: 'power2.inOut' },
      'exit'
    );

    triggers.push(tl.scrollTrigger!);

    return () => {
      triggers.forEach(st => st.kill());
      tl.kill();
    };
  }, []);

  return (
    // z-20: must paint ABOVE SkinProtectionSection (z-10), which is pulled up
    // -100svh to slide in underneath while this section's exit dissolve plays.
    <section ref={containerRef} className="relative w-full h-[100svh] bg-transparent z-20 flex flex-col items-center justify-center px-6 md:px-20 lg:px-32 overflow-hidden">

      {/* Background: cloth flowing in air — long silk ribbons in the brand's
          molten-red palette drift, rotate and skew like fabric caught mid-air,
          and an SVG turbulence filter warps the whole layer for a soft,
          breathing air-current distortion instead of static blobs. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="clothTurbulence" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" numOctaves={2} seed={7} result="noise">
            <animate
              attributeName="baseFrequency"
              values="0.006 0.012;0.010 0.007;0.006 0.012"
              dur="22s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={55} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div ref={bgLayerRef} className="absolute inset-0 z-0 clothing-mesh overflow-hidden">
        <div className="clothing-cloth-field">
          <div className="clothing-ribbon clothing-ribbon-1" />
          <div className="clothing-ribbon clothing-ribbon-2" />
          <div className="clothing-ribbon clothing-ribbon-3" />
          <div className="clothing-ribbon clothing-ribbon-4" />
        </div>
        <div className="absolute inset-0 bg-[#3D0F09]/25"></div>
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
