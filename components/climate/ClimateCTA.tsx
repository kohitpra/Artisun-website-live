'use client';

import { motion } from 'framer-motion';

export default function ClimateCTA() {
  return (

    <section className="relative z-10 w-full min-h-auto flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 text-[var(--brand-cream)] overflow-hidden">
      {/* Container to sync Heading & Paragraph Width */}
      <div className="flex flex-col items-center w-full max-w-[800px] text-center px-2 my-0">

        {/* 1. Uppercase Serif Heading (Mobile: 30px safe, Desktop: untouched) */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="font-editorial text-[27px] xs:text-[30px] sm:text-[clamp(2.2rem,4.8vw,4.6rem)] leading-[1.05] tracking-tight font-normal uppercase mb-2 sm:mb-3 whitespace-nowrap"
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

        {/* 3. Styled Single Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center mt-5"
        >
          <a
            href="/all-products"
            className="inline-flex items-center justify-center py-3 px-6 sm:px-7 bg-[#E6D5C1] hover:bg-[#dcc8b1] text-[#A52A2C] font-suisse text-xs sm:text-[13px] uppercase tracking-[0.16em] font-semibold rounded-none border border-[#A52A2C]/10 shadow-md transition-all duration-300 text-center whitespace-nowrap"
          >
            Wear Artisun
          </a>
        </motion.div>

      </div>

    </section>
  );
}