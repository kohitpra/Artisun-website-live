'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const keyholeTitle = "Welcome to Climate-smart Skinwear™";
const keyholeSubtitle = "Clothing for your skin, built for daily life.";

export default function KeyholeSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  titleWordsRef.current = [];
  subWordsRef.current = [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── ENTRY: Rising Portal — rises from bottom with rounded top ──
    gsap.set(containerRef.current, { clipPath: 'inset(100% 0% 0% 0% round 20px)' });
    const scaleEntrySt = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 90%',
      end: 'top top',
      scrub: true,
      animation: gsap.to(containerRef.current, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'power3.out',
      }),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=200%", // Drastically shortened scroll length so it happens very quickly
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      }
    });

    // 1. Zoom the keyhole massively so the viewer "enters" it
    // We only scale the inner mask group, NOT the SVG, so the complex
    // animated ribbons don't get blown up (which would hang the GPU).
    // Using svgOrigin ensures we scale exactly from the center of the hole (960, 380)
    // regardless of the screen size or aspect ratio.
    gsap.set(maskGroupRef.current, { svgOrigin: '960 380' });
    tl.to(maskGroupRef.current, {
      scale: 80,
      duration: 3,
      ease: "power2.inOut",
    }, 0); // Start at absolute time 0

    // 2. Fade out the landscape image FAST at the start of the zoom
    tl.to(imageLayerRef.current, {
      opacity: 0,
      duration: 1.5, 
      ease: "power2.out"
    }, 0);

    // 3. Fade in the content container
    tl.to(contentRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 1.0);

    // 3b. Word-by-word highlight for title
    tl.to(titleWordsRef.current, {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
    }, 1.2);

    // 3c. Word-by-word highlight for subtitle
    tl.to(subWordsRef.current, {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
    }, 1.8);

    // 4. Hold the final frame
    tl.to({}, { duration: 1.0 });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
      scaleEntrySt.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <section ref={containerRef} className="relative w-full h-[100svh] bg-transparent z-10 flex flex-col items-center justify-center overflow-hidden">

      {/* 
        The landscape image layer. 
        It sits above the section's red background. 
      */}
      <div ref={imageLayerRef} className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/keyhole-bg.webp')}
          alt="Keyhole Background"
          className="w-full h-[120vh] object-cover scale-110"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* The new text content. Appears after the image fades out. */}
      <div
        ref={contentRef}
        className="relative z-10 opacity-0 flex flex-col items-center justify-center text-center px-6 w-full"
      >
        <h2 className="font-editorial font-normal text-[26px] md:text-[38px] lg:text-[50px] text-[#e8dfc5] leading-[1.2] tracking-wide flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em]">
          {keyholeTitle.split(" ").map((word, i) => (
            <span
              key={`kt-${i}`}
              ref={el => { if (el) titleWordsRef.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </h2>
        <p className="font-editorial font-normal text-[#e8dfc5]/90 mt-[0.2em] text-[26px] md:text-[38px] lg:text-[50px] leading-[1.2] tracking-wide flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em]">
          {keyholeSubtitle.split(" ").map((word, i) => (
            <span
              key={`ks-${i}`}
              ref={el => { if (el) subWordsRef.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* 
        The SVG Keyhole Mask Overlay 
        Instead of scaling the SVG (and multiplying filter render cost by 40x),
        we scale a group inside the mask. The clothing-mesh background is
        rendered natively via foreignObject, so it stays crisp and performant.
      */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full origin-center"
        >
          <defs>
            <mask id="keyholeMask">
              {/* White = opaque background (show the ribbons) */}
              <rect width="1920" height="1080" fill="white" />
              {/* Black = transparent cutout (The Keyhole hole that scales up) */}
              <g ref={maskGroupRef}>
                <circle cx="960" cy="380" r="140" fill="black" />
                <polygon points="890,501 790,840 1130,840 1030,501" fill="black" />
              </g>
            </mask>
          </defs>
          
          {/* Apply the mask to a foreignObject containing the HTML ribbons */}
          <g mask="url(#keyholeMask)">
             <foreignObject width="1920" height="1080">
                <div className="w-full h-full clothing-mesh relative overflow-hidden">
                   <div className="clothing-cloth-field">
                     <div className="clothing-ribbon clothing-ribbon-1" />
                     <div className="clothing-ribbon clothing-ribbon-2" />
                     <div className="clothing-ribbon clothing-ribbon-3" />
                     <div className="clothing-ribbon clothing-ribbon-4" />
                   </div>
                </div>
             </foreignObject>
          </g>
        </svg>
      </div>

      </section>
    </div>
  );
}
