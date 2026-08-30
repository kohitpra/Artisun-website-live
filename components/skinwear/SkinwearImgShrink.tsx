'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

/*
 * Mobile strategy:
 * - Image shrinks from full-screen height → ~48% (top half)
 * - Text block is pinned immediately below the image via `top` transform (not bottom-0)
 *   so there is zero gap between image bottom edge and text top edge.
 * - Desktop (≥md): original horizontal shrink, image right → text left.
 */
export default function SkinwearImgShrink() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── DESKTOP: width shrink, image anchored right ──
  const imageWidth = useTransform(scrollYProgress, [0.2, 0.62], ['100%', '40%']);

  // ── MOBILE: height shrink; image + text centered as one group ──
  // Shrinks to 48% of 100svh
  const imageHeight = useTransform(scrollYProgress, [0.1, 0.55], ['100%', '48%']);

  // Text reveal
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.58, 1], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.25, 0.58, 1], [16, 0, 0]);

  // Desktop text slide-in
  const textX = useTransform(scrollYProgress, [0.28, 0.62, 1], [-28, 0, 0]);

  const textBlur = useTransform(scrollYProgress, [0.25, 0.58, 1], ['8px', '0px', '0px']);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[150vh] sm:h-[160vh] md:h-[180vh] z-[16]"
    >
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center px-5 sm:px-8 md:px-16 lg:px-24">

        {/* ── MOBILE LAYOUT (< md) ── */}
        <div className="md:hidden w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">

          {/* Image — shrinks from full-screen to a smaller centered block */}
          <motion.div
            style={{ height: imageHeight }}
            className="relative w-full shrink-0 overflow-hidden rounded-[14px] z-20"
          >
            <Image
              src="/skinwear-media/Third picture.webp"
              alt="Skinwear"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          {/* Text — sits directly beneath the image */}
          <motion.div
            style={{ opacity: textOpacity, y: textY, filter: textBlur }}
            className="w-full px-4 sm:px-6 pt-3 sm:pt-4 flex flex-col space-y-1.5 sm:space-y-2.5 z-10"
          >
            <p className="font-suisse text-[var(--brand-cream)]/70 text-[11px] tracking-widest uppercase font-normal">
              Fashion is how you dress your body
            </p>
            <h2 className="font-editorial text-[var(--brand-cream)] text-[clamp(1.75rem,8.5vw,2.8rem)] leading-[1.08] tracking-[-0.02em]">
              Skinwear is how<br />you dress your skin
            </h2>
            <p className="font-suisse text-[var(--brand-cream)]/85 text-[14.5px] sm:text-[15.5px] leading-[1.5] max-w-[320px]">
              So we&apos;re changing where sun care sits. Out of the cabinet, into the conversation. Chosen with intent, worn like you mean it.
            </p>
          </motion.div>
        </div>

        {/* ── DESKTOP LAYOUT (≥ md) ── */}
        <div className="hidden md:block w-full max-w-[1300px] h-[75vh] relative">

          {/* Left text */}
          <motion.div
            style={{ opacity: textOpacity, x: textX, filter: textBlur }}
            className="absolute left-0 top-0 h-full w-[62%] flex flex-col justify-center space-y-5 md:space-y-7 text-left z-10"
          >
            <p className="font-suisse text-[var(--brand-cream)]/80 text-[15px] md:text-[18px] lg:text-[20px] tracking-wide font-normal">
              Fashion is how you dress your body
            </p>
            <h2 className="font-editorial text-[var(--brand-cream)] text-[clamp(1.8rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-0.02em]">
              Skinwear is how<br />you dress your skin
            </h2>
            <p className="font-suisse text-[var(--brand-cream)]/90 text-[15px] md:text-[18px] lg:text-[21px] leading-[1.5] max-w-[540px] lg:max-w-[640px]">
              So we&apos;re changing where sun care sits.
              Out of the cabinet, into the conversation. Chosen
              with intent, worn like you mean it — the same way
              you choose everything else that&apos;s seen.
            </p>
          </motion.div>

          {/* Right image — shrinks from 100% to 40% width */}
          <motion.div
            style={{ width: imageWidth }}
            className="absolute right-0 top-0 h-full overflow-hidden z-20 rounded-[10px]"
          >
            <Image
              src="/skinwear-media/Third picture.webp"
              alt="Skinwear Red Box Visual"
              fill
              sizes="(max-width: 1024px) 60vw, 40vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
