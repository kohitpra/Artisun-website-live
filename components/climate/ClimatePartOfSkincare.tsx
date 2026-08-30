'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { asset } from '@/lib/asset';

// Fast Pointer Variants for Desktop/Tablet
const leftPointerVariants: Variants = {
  hidden: { opacity: 0, x: -25 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      delay: 0.15 + i * 0.08,
      ease: 'easeOut',
    },
  }),
};

const rightPointerVariants: Variants = {
  hidden: { opacity: 0, x: 25 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      delay: 0.2 + i * 0.08,
      ease: 'easeOut',
    },
  }),
};

const MOBILE_POINTS = [
  "The sun you don't feel ages your skin",
  "A warm day pushes your oil up by mid-morning",
  "Office AC quietly pulls your skin's moisture out",
  "Damp air decides whether anything you put on stays put"
];

export default function ClimatePartOfSkincare() {
  return (
    <section className="relative z-10 w-full min-h-auto lg:min-h-[85vh] flex flex-col items-center justify-center px-3 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16">

      {/* 1. Top Serif Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="font-editorial text-[clamp(1.8rem,5.2vw,4.2rem)] text-center mb-6 sm:mb-8 md:mb-12 tracking-wide font-normal uppercase px-2 leading-tight"
      >
        Climate is (a part of) skincare
      </motion.h2>

      {/* 2. Main Wrapper Container */}
      <div className="relative w-full max-w-[1280px] flex items-center justify-center">

        {/* --- DESKTOP & TABLET LAYOUT (640px and up) --- */}
        <div className="hidden sm:flex flex-row items-center justify-center gap-1 md:gap-2 lg:gap-0 w-full">

          {/* LEFT POINTERS CONTAINER */}
          <div className="flex flex-col justify-between sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[480px] sm:w-[160px] md:w-[220px] lg:w-[300px] xl:w-[380px] text-center z-20 sm:py-2 md:py-3 lg:py-4">
            {/* Point 1: Top Left */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={leftPointerVariants}
              className="flex items-center justify-end gap-1 sm:translate-x-4 md:translate-x-6 lg:translate-x-10 mt-2"
            >
              <p className="sm:text-xs md:text-base lg:text-lg xl:text-xl font-sans font-normal leading-snug opacity-95 text-center">
                The sun you don&rsquo;t<br />feel ages your skin
              </p>
              <span className="sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[1px] bg-white/90 flex-shrink-0 sm:-mr-2 md:-mr-3 lg:-mr-4 relative z-30 shadow-sm" />
            </motion.div>

            {/* Point 3: Bottom Left */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={leftPointerVariants}
              className="flex items-center justify-end gap-1 sm:translate-x-4 md:translate-x-6 lg:translate-x-10 sm:mb-8 md:mb-12 lg:mb-16"
            >
              <p className="sm:text-xs md:text-base lg:text-lg xl:text-xl font-sans font-normal leading-snug opacity-95 text-center">
                Office AC quietly pulls<br />your skin&rsquo;s moisture out
              </p>
              <span className="sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[1px] bg-white/90 flex-shrink-0 sm:-mr-2 md:-mr-3 lg:-mr-4 relative z-30 shadow-sm" />
            </motion.div>
          </div>

          {/* CENTER MAIN IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative sm:w-[220px] sm:h-[280px] md:w-[220px] md:h-[280px] lg:w-[320px] lg:h-[400px] xl:w-[420px] xl:h-[520px] flex-shrink-0 overflow-hidden shadow-2xl z-10 rounded-none border border-white/10"
          >
            <Image
              src={asset('/climate-face.webp')}
              alt="Climate impact on skin"
              fill
              sizes="(max-width: 768px) 220px, (max-width: 1024px) 320px, 420px"
              className="object-cover"
            />
          </motion.div>

          {/* RIGHT POINTERS CONTAINER */}
          <div className="flex flex-col justify-between sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[480px] sm:w-[160px] md:w-[220px] lg:w-[300px] xl:w-[380px] text-center z-20 sm:py-2 md:py-3 lg:py-4">
            {/* Point 2: Top Right */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={rightPointerVariants}
              className="flex items-center justify-start gap-1 sm:-translate-x-4 md:-translate-x-6 lg:-translate-x-10 sm:mt-14 md:mt-16 lg:mt-24"
            >
              <span className="sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[1px] bg-white/90 flex-shrink-0 sm:-ml-2 md:-ml-3 lg:-ml-4 relative z-30 shadow-sm" />
              <p className="sm:text-xs md:text-base lg:text-lg xl:text-xl font-sans font-normal leading-snug opacity-95 text-center">
                A warm day pushes your<br />oil up by mid-morning
              </p>
            </motion.div>

            {/* Point 4: Bottom Right */}
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={rightPointerVariants}
              className="flex items-center justify-start gap-1 sm:-translate-x-4 md:-translate-x-6 lg:-translate-x-10 md:mb-3 lg:mb-4"
            >
              <span className="sm:w-8 md:w-12 lg:w-16 xl:w-20 h-[1px] bg-white/90 flex-shrink-0 sm:-ml-2 md:-ml-3 lg:-ml-4 relative z-30 shadow-sm" />
              <p className="sm:text-xs md:text-base lg:text-lg xl:text-xl font-sans font-normal leading-snug opacity-95 text-center">
                Damp air decides whether<br />anything you put on stays put
              </p>
            </motion.div>
          </div>

        </div>

        {/* --- MOBILE LAYOUT (under 640px): Left Image & Right Pointers --- */}
        <div className="flex sm:hidden flex-row items-center justify-between gap-3 w-full max-w-[480px] px-2 py-2">

          {/* Left: Model Portrait Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-[130px] min-[400px]:w-[145px] h-[210px] min-[400px]:h-[235px] flex-shrink-0 overflow-hidden shadow-xl rounded-none border border-white/10"
          >
            <Image
              src={asset('/climate-face.webp')}
              alt="Climate impact on skin"
              fill
              sizes="145px"
              className="object-cover"
            />
          </motion.div>

          {/* Right: Stacked 4 Text Pointers with Arrows extended into the Left Image */}
          <div className="flex flex-col justify-between h-[210px] min-[400px]:h-[235px] flex-1 py-1 z-20">
            {MOBILE_POINTS.map((text, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.1 * idx }}
                className="flex items-center gap-1 -ml-6 min-[400px]:-ml-7 relative z-20"
              >
                {/* Pointer Line extending slightly inside the Image on Left */}
                <span className="w-6 min-[400px]:w-8 h-[1px] bg-white/90 flex-shrink-0 relative z-30 shadow-md" />
                <p className="text-[11px] min-[400px]:text-[12px] font-sans font-normal leading-tight opacity-95 text-left">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* 3. Bottom Subline under Image */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-suisse text-center text-[15px] min-[400px]:text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-[var(--brand-cream)] mt-8 sm:mt-10 md:mt-12 px-4 max-w-[95vw] lg:max-w-[1250px] font-normal leading-[1.3] tracking-tight whitespace-normal sm:whitespace-nowrap"
      >
        Even the same routine can perform differently depending on where you are.
      </motion.p>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />

    </section>
  );
}