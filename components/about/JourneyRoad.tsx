'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

export default function JourneyRoad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current || !pathRef.current) return;

    if (reduce) {
      gsap.set(pathRef.current, { strokeDasharray: 'none', strokeDashoffset: 0 });
      return;
    }

    const path = pathRef.current;
    const length = path.getTotalLength();
    
    gsap.set(path, { 
      strokeDasharray: length, 
      strokeDashoffset: length 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1,
      }
    });

    // Draw the string
    tl.to(path, {
      strokeDashoffset: 0,
      ease: 'none'
    });

    // Fade in text blocks at specific percentages of the timeline
    // Block 1: 15% down the line
    tl.fromTo(textRefs.current[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.1 }, 0.15);
    // Block 2: 50% down the line
    tl.fromTo(textRefs.current[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.1 }, 0.50);
    // Block 3: 85% down the line
    tl.fromTo(textRefs.current[2], { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.1 }, 0.85);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [reduce]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[1000px] mx-auto min-h-[200vh] md:min-h-[250vh] py-20 overflow-visible">
      {/* SVG String */}
      <div 
        className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' 
        }}
      >
        <svg 
          viewBox="0 0 1000 2600" 
          preserveAspectRatio="none" 
          className="w-full h-full drop-shadow-[0_0_15px_rgba(242,166,92,0.4)]"
          fill="none"
        >
          <path
            ref={pathRef}
            d="M 500 0 
               C 500 300, 200 300, 200 600
               C 200 900, 800 1000, 800 1300
               C 800 1600, 200 1700, 200 2000
               C 200 2300, 500 2450, 500 2600"
            stroke="url(#roadGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2A65C" stopOpacity="0" />
              <stop offset="15%" stopColor="#F2A65C" />
              <stop offset="50%" stopColor="#C9401A" />
              <stop offset="98%" stopColor="#F2A65C" />
              <stop offset="100%" stopColor="#F2A65C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Blocks */}
      
      {/* Block 1: Right of the first left curve */}
      <div 
        ref={el => { textRefs.current[0] = el; }}
        className="absolute top-[20%] right-[5%] md:right-[15%] w-[70%] md:w-[45%] text-left flex flex-col gap-4 font-editorial"
      >
        <p className="text-[var(--brand-cream)] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2]">
          Artisun is just getting started.
        </p>
        <p className="font-editorial text-[var(--brand-cream)]/70 text-[14px] sm:text-[15px] md:text-[clamp(1.1rem,1.5vw,1.4rem)]">
          What you see today is the beginning of a longer collection.
        </p>
      </div>

      {/* Block 2: Left of the right curve */}
      <div 
        ref={el => { textRefs.current[1] = el; }}
        className="absolute top-[45%] left-[5%] md:left-[10%] w-[70%] md:w-[45%] text-left md:text-right flex flex-col gap-4 font-editorial"
      >
        <p className="text-[var(--brand-cream)] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2]">
          A collection focused on suncare and designed as skinwear.
        </p>
        <p className="font-editorial text-[var(--brand-cream)]/70 text-[14px] sm:text-[15px] md:text-[clamp(1.1rem,1.5vw,1.4rem)]">
          Different layers for different mornings and different climates, each one built to the same standard.
        </p>
      </div>

      {/* Block 3: Right of the second left curve */}
      <div 
        ref={el => { textRefs.current[2] = el; }}
        className="absolute top-[75%] right-[5%] md:right-[15%] w-[70%] md:w-[45%] text-left flex flex-col gap-4"
      >
        <p className="font-editorial text-[var(--brand-cream)] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.2]">
          Artisun is bringing to you two layers.
        </p>
        <p className="font-suisse font-light text-[var(--brand-cream)]/70 text-[14px] sm:text-[16px] md:text-xl leading-relaxed">
          In years to come, it’ll grow with you, for you.
        </p>
        <p className="font-editorial italic text-[#F2A65C] text-[16px] sm:text-[18px] md:text-3xl mt-2">
          For your skin, your needs and your climate.
        </p>
      </div>
    </div>
  );
}
