'use client';

import { useState } from 'react';
import Image from '@/components/media/SizedImage';
import { asset } from '@/lib/asset';

type Ingredient = {
  name: string;
  source: string;
  hook: string;
  long: string;
};

const INGREDIENTS: Ingredient[] = [
  {
    name: 'Ectoin',
    source: 'Germany',
    hook: 'Deeply hydrates and shields from pollution.',
    long: 'A powerful active from Germany that locks moisture into the skin and protects against heat, pollution, and daily UV stress.',
  },
  {
    name: 'Sodium Hyaluronate',
    source: 'Refined HA',
    hook: 'Plumps the skin for a soft, dewy glow.',
    long: 'Refined hyaluronic acid that draws moisture into the skin, giving it a hydrated, lit-from-within finish without any shimmer.',
  },
  {
    name: 'Bisabolol',
    source: 'Chamomile',
    hook: 'Calms redness and soothes sensitive skin.',
    long: 'Extracted from chamomile to soothe irritation, reduce redness, and keep the skin barrier calm and even.',
  },
  {
    name: 'Uvinul A Plus',
    source: 'Germany',
    hook: 'Advanced UVA filter, photostable for 8 hours.',
    long: 'One of the world’s most advanced UVA filters that stays completely stable under direct sunlight throughout the day.',
  },
];

export default function AuraWhatsIn() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      id="aura-whatsin"
      className="aura-panel relative w-screen shrink-0 h-[100svh] overflow-hidden flex flex-col justify-start lg:justify-center pt-8 pb-6 sm:py-16 lg:py-10 px-5 sm:px-8 lg:px-14 text-[var(--brand-cream)]"
      style={{ background: 'var(--bg-eclipse)' }}
    >
      {/* Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 h-full lg:h-auto w-full max-w-[1440px] lg:max-w-[1500px] mx-auto flex flex-col justify-start md:justify-between lg:justify-center">
        {/* Heading */}
        <div className="shrink-0 md:pt-2 lg:pt-14 xl:pt-16">
          <span className="font-suisse text-[11px] sm:text-xs md:text-[13px] tracking-[0.22em] lg:tracking-[0.2em] uppercase text-[#E8DCC8]/70">
            What&apos;s in it
          </span>
         <h2 className="font-editorial text-[30px] sm:text-[46px] md:text-[48px] lg:text-[58px] leading-[1.08] lg:leading-[1.03] text-[#E8DCC8] tracking-tight not-italic mt-2 md:mt-3 lg:mt-1 max-w-[18ch] lg:max-w-none lg:whitespace-nowrap">
            Sourced better than they needed to be.
          </h2>
        </div>

        {/* Center Grid */}
        <div className="w-full flex flex-col md:grid md:grid-cols-[1fr_1.1fr] lg:grid-cols-2 gap-3 sm:gap-4 md:gap-8 lg:gap-14 items-center justify-center min-h-0 mt-3 sm:mt-4 md:my-auto lg:my-auto lg:pt-4">
          
          {/* Left Visual Image */}
          <div className="relative w-full h-[27vh] sm:h-[30vh] md:h-[580px] md:min-h-[580px] md:max-h-[620px] max-h-[480px] md:max-h-none lg:h-[400px] lg:min-h-0 lg:max-h-[420px] xl:h-[400px] rounded-2xl lg:rounded-none overflow-hidden border border-[#E6D5C1]/10 shadow-2xl bg-white/5 shrink-0">
            <Image
              src={asset('/pdp/aura-whatsin.webp')}
              alt="Aura Ingredients"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Ingredient Accordion List */}
          <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 md:space-y-4 lg:space-y-2.5 justify-center shrink-0 md:max-h-none lg:max-h-[420px] lg:max-w-[540px] lg:mx-0">

            {INGREDIENTS.map((ing, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={ing.name}
                  className={`border rounded-xl md:rounded-2xl p-2.5 sm:p-3.5 md:p-5 lg:py-3 lg:px-4 lg:rounded-none backdrop-blur-sm transition-all duration-300 ${isOpen
                      ? 'border-[#E6D5C1]/25 bg-white/[0.08] shadow-md'
                      : 'border-[#E6D5C1]/10 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="font-suisse text-[13px] sm:text-[15px] md:text-[17px] lg:text-[16px] font-medium text-[var(--brand-cream)] leading-snug">
                        {ing.name} <span className="text-[var(--brand-cream)]/50 text-[11px] sm:text-xs md:text-[13px] font-normal">· {ing.source}</span>
                      </div>
                      <div className="font-suisse text-[10.5px] sm:text-xs md:text-[13.5px] text-[var(--brand-cream)]/75 mt-0.5 md:mt-1 leading-snug">
                        {ing.hook}
                      </div>
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl leading-none text-[var(--brand-cream)]/60 transition-transform duration-300 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-[300ms] ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-suisse text-[11px] sm:text-xs md:text-[13px] leading-relaxed text-[var(--brand-cream)]/80 pt-2 md:pt-3 border-t border-[#E6D5C1]/10 mt-2 md:mt-3">
                        {ing.long}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      <div className="hidden lg:block relative z-10 max-w-[1500px] w-full mx-auto pt-2" />
    </div>
  );
}