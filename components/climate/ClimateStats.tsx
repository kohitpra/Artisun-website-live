'use client';

import { motion } from 'framer-motion';

export default function ClimateStats() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center px-4 py-12 md:py-16 text-[var(--brand-cream)]">

      {/* 1. Top Sub-heading / Statement */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-[1100px] mb-8 md:mb-12 space-y-3 font-sans px-2"
      >
        
        <p className="text-lg sm:text-2xl md:text-3xl font-normal opacity-95 underline underline-offset-4 leading-relaxed decoration-white/80">
          Understanding the skin means understanding the conditions it lives in.
        </p>
      </motion.div>

      {/* 2. Responsive Cards Grid: Square in 1-line layout (sm:grid-cols-3), Rectangle stacked on small screens */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-[1000px] justify-items-center"
      >

        {/* CARD 1 */}
        <div className="w-full min-h-0 sm:min-h-[310px] bg-black/25 backdrop-blur-md border border-white/10 rounded-none p-5 sm:p-6 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all">
          <div>
            <h3 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal mb-2 sm:mb-3 tracking-tight leading-none">
              10%
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-sans font-normal opacity-95 leading-snug">
              more sebum production takes place for every 1°C rise in the skin temperature.
            </p>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm font-sans text-white/90 text-right mt-4 sm:mt-6 font-normal">
            British Journal of Dermatology, 1970
          </p>
        </div>

        {/* CARD 2 */}
        <div className="w-full min-h-0 sm:min-h-[310px] bg-black/25 backdrop-blur-md border border-white/10 rounded-none p-5 sm:p-6 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all">
          <div>
            <h3 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal mb-2 sm:mb-3 tracking-tight leading-none">
              2 hrs
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-sans font-normal opacity-95 leading-snug">
              at 32°C is enough to measurably raise both sebum and inflammation markers in the skin.
            </p>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm font-sans text-white/90 text-right mt-4 sm:mt-6 font-normal">
            Fudan University, Shanghai<br />
            Environmental Research, 2025
          </p>
        </div>

        {/* CARD 3 */}
        <div className="w-full min-h-0 sm:min-h-[310px] bg-black/25 backdrop-blur-md border border-white/10 rounded-none p-5 sm:p-6 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all">
          <div>
            <h3 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal mb-2 sm:mb-3 tracking-tight leading-none">
              20%
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-sans font-normal opacity-95 leading-snug">
              more pigment spots on the forehead and cheeks, in skin exposed to more traffic particles.
            </p>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm font-sans text-white/90 text-right mt-4 sm:mt-6 font-normal">
            Journal of Investigative<br />
            Dermatology, 2010
          </p>
        </div>

      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />


    </section>
  );
}