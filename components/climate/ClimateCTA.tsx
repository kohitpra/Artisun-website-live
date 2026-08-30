'use client';

import { motion } from 'framer-motion';

export default function ClimateCTA() {
  return (

    <section className="relative z-10 w-full min-h-auto flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 text-[var(--brand-cream)] overflow-hidden">
      {/* Container to sync Heading & Paragraph Width */}
      <div className="flex flex-col items-center w-full max-w-[800px] text-center px-2 my-0">

        {/* 1. Uppercase Serif Heading (Responsive clamp, wrap-safe) */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="font-editorial text-[clamp(1.8rem,5vw,3.6rem)] tracking-tight font-normal uppercase mb-2 sm:mb-3 leading-tight"
        >
          Designed for exposure
        </motion.h2>

        {/* 2. Subtitle / Paragraph Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-base sm:text-xl md:text-2xl font-normal opacity-95 leading-relaxed mb-4 md:mb-6 max-w-[1100px] w-full"
        >
          <p className="md:whitespace-nowrap">
            Your skin changes with the weather. So does the way you wear it.
          </p>
          <p className="mt-1 md:whitespace-nowrap">
            What’s your skin wearing today?
          </p>
        </motion.div>

        {/* 3. Styled Pill Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4"
        >
          <a
            href="/origin"
            className="inline-flex items-center justify-center min-w-[200px] px-8 py-3.5 md:py-4 bg-[#EAE3D2] hover:bg-[#FAF6EE] text-[#8B1E13] font-editorial text-[17px] md:text-[19px] font-medium tracking-wide rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 text-center"
          >
            Shop Origin
          </a>

          <a
            href="/aura"
            className="inline-flex items-center justify-center min-w-[200px] px-8 py-3.5 md:py-4 bg-[#EAE3D2] hover:bg-[#FAF6EE] text-[#8B1E13] font-editorial text-[17px] md:text-[19px] font-medium tracking-wide rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 text-center"
          >
            Shop Aura
          </a>
        </motion.div>

      </div>

    </section>
  );
}