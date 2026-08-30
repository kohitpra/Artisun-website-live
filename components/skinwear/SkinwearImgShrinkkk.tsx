'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

/*
 * Mirror of SkinwearImgShrink — image on left (desktop), text on right.
 * Mobile: same vertical strategy — image shrinks to top, text rises below.
 */
export default function SkinwearImgShrink2() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── DESKTOP: horizontal width shrink (image anchored left) ──
  const imageWidth = useTransform(
    scrollYProgress,
    [0.2, 0.62],
    ['100%', '40%']
  );

  // ── MOBILE: vertical height shrink (image anchored top) ──
  const imageHeight = useTransform(
    scrollYProgress,
    [0.15, 0.55],
    ['100%', '44%']
  );

  // Text reveal — shared timing
  const textOpacity = useTransform(scrollYProgress, [0.28, 0.62, 1], [0, 1, 1]);

  // Desktop text: slides in from right
  const textX = useTransform(scrollYProgress, [0.28, 0.62, 1], [28, 0, 0]);

  // Mobile text: slides up
  const textY = useTransform(scrollYProgress, [0.28, 0.62, 1], [24, 0, 0]);

  const textBlur = useTransform(
    scrollYProgress,
    [0.28, 0.62, 1],
    ['8px', '0px', '0px']
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[150vh] sm:h-[160vh] md:h-[180vh] z-[16]"
    >
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center px-5 sm:px-8 md:px-16 lg:px-24">

        {/* ── MOBILE LAYOUT (< md) ── */}
        <div className="md:hidden w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">

          {/* Image — shrinks from full height to a smaller centered block */}
          <motion.div
            style={{ height: imageHeight }}
            className="relative w-full shrink-0 overflow-hidden rounded-[12px] z-20"
          >
            <Image
              src="/skinwear-media/Fourth picture.webp"
              alt="Skinwear Red Box Visual"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          {/* Text — sits directly beneath the image */}
          <motion.div
            style={{ opacity: textOpacity, y: textY, filter: textBlur }}
            className="w-full px-4 sm:px-6 pt-3 sm:pt-4 flex flex-col items-end space-y-1.5 sm:space-y-2.5 z-10 text-right"
          >
            <h2 className="font-editorial text-[var(--brand-cream)] text-[clamp(1.9rem,9vw,3rem)] leading-[1.08] tracking-[-0.02em]">
              Your skin now has<br />a wardrobe of its own.
            </h2>
            <p className="font-suisse text-[var(--brand-cream)]/85 text-[14.5px] sm:text-[15.5px] leading-[1.5] max-w-[320px]">
              This is the start of sun care, made the way fashion is. Considered, worn with intent and built for the day you&apos;re actually having.
            </p>
          </motion.div>
        </div>

        {/* ── DESKTOP LAYOUT (≥ md) ── */}
        <div className="hidden md:block w-full max-w-[1300px] h-[75vh] relative">

          {/* Left image — shrinks from 100% to 40% width */}
          <motion.div
            style={{ width: imageWidth }}
            className="absolute left-0 top-0 h-full overflow-hidden z-20 rounded-[10px]"
          >
            <Image
              src="/skinwear-media/Fourth picture.webp"
              alt="Skinwear Red Box Visual"
              fill
              sizes="(max-width: 1024px) 60vw, 40vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          {/* Right text */}
          <motion.div
            style={{ opacity: textOpacity, x: textX, filter: textBlur }}
            className="absolute right-0 top-0 h-full w-[62%] flex flex-col justify-center space-y-5 md:space-y-7 text-right z-10"
          >
            <h2 className="font-editorial text-[var(--brand-cream)] text-[clamp(1.8rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-0.02em]">
              Your skin now has a<br />wardrobe of its own.
            </h2>
            <p className="font-suisse text-[var(--brand-cream)]/90 text-[15px] md:text-[18px] lg:text-[21px] leading-[1.5] max-w-[540px] lg:max-w-[640px] ml-auto">
              This is the start of sun care, made the way fashion is.
              Considered, worn with intent and built for the day
              you&apos;re actually having.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
