'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { asset } from '@/lib/asset';

/*
 * FRAME 1 — molten-core opening section.
 * On scroll, a 3:4 model portrait rises with text overlay styled directly inside the image frame (Image 2 style).
 */
export default function SkinwearImageReveal() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // 1st Background image — stays 100% opaque fixed background (no red bleed effect).
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 1]);
  const bgScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.04]);

  // 2nd Image Card — Phase 1: rises and settles into place FIRST (0 to 0.5)
  const imageY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.45, 0.5],
    ['105vh', '85vh', '40vh', '10vh', '0vh']
  );
  const imageScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.92, 0.96, 1]);

  // Text — Phase 2: fades in & stays 100% visible on further scroll (no fade-out)
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.85, 1], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.55, 0.85, 1], [20, 0, 0]);

  return (
    <section ref={sectionRef} className="relative z-[15] w-full h-[250vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">

        {/* 1st Image (Fixed Background Image - stays full page until 2nd image scrolls up over it) */}
        <motion.div
          style={{ opacity: bgOpacity, scale: bgScale }}
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={asset('/skinwear-media/First picture landscape.webp')}
              alt="Artisun Skinwear Hero"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            {/* Subtle dark overlay for UI readability without changing background tone */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        </motion.div>

        {/* 2nd Image Card — rises directly OVER the background image on scroll */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="
            relative z-[10]
            w-[clamp(270px,68vw,380px)] md:w-[clamp(340px,38vw,500px)]
            aspect-[3/4]
            max-h-[80svh]
            will-change-transform
            flex items-center justify-center
          "
        >
          {/* Big model frame — 3:4 portrait (clean without any text inside) */}
          <div className="relative w-full h-full overflow-hidden rounded-xl shadow-[0_50px_120px_rgba(0,0,0,0.9)] group backdrop-blur-sm">
            <Image
              src={asset('/skinwear-media/Second picture.webp')}
              alt="Skinwear"
              fill
              sizes="(max-width: 768px) 68vw, 38vw"
              className="object-cover"
              priority
            />

            {/* Dark vignette gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none" />
          </div>

          {/* Overlapping Center Text — fades in only after the image has settled */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-4"
          >
            <h2 className="font-editorial whitespace-nowrap text-[clamp(1.2rem,3.4vw,2.3rem)] text-[var(--brand-cream)] leading-none tracking-[-0.01em] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] text-center">
              Our word for a thing that didn’t have one
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}