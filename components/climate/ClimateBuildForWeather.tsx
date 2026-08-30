'use client';

import { motion } from 'framer-motion';

export default function ClimateSkinVsWeather() {
  return (
    <section
      className="relative z-10 w-full flex flex-col items-center justify-center px-6 py-16 md:py-24 overflow-hidden"
    >

      {/* Content wrapper */}
      <div className="w-full max-w-[1300px] mx-auto text-center space-y-10 md:space-y-14 text-[#fff8f0]">

        {/* --- BLOCK 1 --- */}
        {/* Gap kam karne ke liye space-y-2 md:space-y-3 use kiya hai */}
        <div className="space-y-2 md:space-y-3">
          {/* H1: Heading size ko clamp scale reduce karke chota kiya hai */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="font-editorial text-[clamp(2rem,4.5vw,4.2rem)] leading-[1.08] tracking-tight"
          >
            Why we build for weather,<br />
            not just skin type
          </motion.h1>

          {/* P1 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="font-sans text-[clamp(1rem,1.8vw,1.4rem)] leading-relaxed max-w-[1000px] mx-auto opacity-90"
          >
            Every sunscreen asks the same question: oily or dry? But your skin isn’t oily
            <br className="hidden sm:inline" />
            or dry in a fixed way. It changes the second the weather does — tight in a
            <br className="hidden sm:inline" />
            Delhi December, greasy in a Bombay July, dull in the September smog.
          </motion.p>
        </div>

        {/* --- BLOCK 2 (With Staggered Delay relative to Block 1) --- */}
        <div className="space-y-2 md:space-y-3">
          {/* H2: Appears after Block 1 finishes */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="font-editorial text-[clamp(2rem,4.5vw,4.2rem)] leading-[1.08] tracking-tight"
          >
            Skin type tells you a little,<br />
            the weather tells you everything
          </motion.h2>

          {/* P2: Appears right after H2 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="font-sans text-[clamp(1rem,1.8vw,1.4rem)] leading-relaxed max-w-[950px] mx-auto opacity-90"
          >
            So we stopped sorting sunscreen by skin, and started building it around
            <br className="hidden sm:inline" />
            climate. That’s climate-smart — the same idea, in two products.
          </motion.p>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />

    </section>
  );
}