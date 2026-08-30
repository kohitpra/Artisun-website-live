'use client';

import { motion, useReducedMotion } from 'framer-motion';

const rise = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function FutureShowcase() {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20">
      <div className="w-full px-6 md:px-16 lg:px-24">
        {/* ── Copy + CTA ── */}
        <div className="w-full text-center mx-auto">
          <motion.div {...rise(0, reduce)} className="mb-1 flex items-center justify-center gap-4">
            <span className="font-suisse uppercase tracking-[0.11em] text-[11px] md:text-[30px] text-[var(--brand-cream)]/70">
              In years to come
            </span>
          </motion.div>

          <motion.h2
            {...rise(0.08, reduce)}
            className="about-shine font-editorial leading-[1.02] tracking-[-0.02em] text-[clamp(2.6rem,6vw,4.6rem)] text-center"
          >
            Artisun is just getting started
          </motion.h2>

          <motion.div {...rise(0.16, reduce)} className="mt-8 space-y-6 font-suisse text-[var(--brand-cream)]/80 text-[15px] sm:text-[16px] md:text-[22px] lg:text-[30px] leading-[1.5] md:leading-[1.4] w-full">
            <p>
              What you see today is the beginning of a longer collection
              <br />
              One focused on suncare and designed as Skinwear&trade;
              <br />
              Different layers for different mornings and different climates,
              <br />
              Each one built to the same standard.
            </p>

            <p>
              Artisun is bringing you two layers to begin.
              <br />
              In years to come, it&rsquo;ll grow with you, for you.
              <br />
              For your skin, your needs and your climate.
            </p>
          </motion.div>

          <motion.div {...rise(0.24, reduce)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
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
      </div>
    </section>
  );
}