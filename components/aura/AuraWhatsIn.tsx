'use client';

import { useState } from 'react';
import Image from 'next/image';
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
      className="aura-panel relative w-screen shrink-0 h-[100svh] overflow-hidden flex flex-col justify-start lg:justify-between pt-24 sm:pt-24 lg:pt-24 pb-16 lg:pb-14 px-5 sm:px-8 lg:px-14 text-[var(--brand-cream)]"
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

      <div className="relative z-10 h-full w-full max-w-[1440px] mx-auto flex flex-col justify-start lg:justify-between">
        {/* Heading */}
        <div className="shrink-0">
          <span className="font-suisse text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--brand-cream)]/70">
            What&apos;s in it
          </span>
          <h2 className="font-editorial text-[24px] sm:text-[38px] lg:text-[54px] leading-[1.08] tracking-tight mt-2 max-w-[18ch]">
            Sourced better than they needed to be.
          </h2>
        </div>

        {/* Center Grid */}
        <div className="w-full flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] gap-3 sm:gap-4 lg:gap-12 items-stretch justify-center min-h-0 mt-3 sm:mt-4 lg:my-auto">
          
          {/* Left Visual Image: Perfectly fills tablet/mobile without excessive blank space */}
          <div className="relative w-full h-[24vh] sm:h-[28vh] lg:h-[50vh] xl:h-[54vh] max-h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 shrink-0">
            <Image
              src={asset('/pdp/aura-whatsin.webp')}
              alt="Aura Ingredients"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Ingredient Accordion List */}
          <div className="w-full flex flex-col space-y-1.5 sm:space-y-2 lg:space-y-2.5 justify-center shrink-0 lg:max-h-[50vh] xl:max-h-[54vh]">

            {INGREDIENTS.map((ing, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={ing.name}
                  className={`border rounded-xl p-2.5 sm:p-3.5 lg:p-4 backdrop-blur-sm transition-all duration-300 ${isOpen
                      ? 'border-white/25 bg-white/[0.08] shadow-md'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="font-suisse text-[13px] sm:text-[15px] lg:text-[16px] font-medium text-[var(--brand-cream)] leading-snug">
                        {ing.name} <span className="text-[var(--brand-cream)]/50 text-[11px] sm:text-xs font-normal">· {ing.source}</span>
                      </div>
                      <div className="font-suisse text-[10.5px] sm:text-xs text-[var(--brand-cream)]/75 mt-0.5 leading-snug">
                        {ing.hook}
                      </div>
                    </div>
                    <span className="text-lg sm:text-xl leading-none text-[var(--brand-cream)]/60 transition-transform duration-300 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-[300ms] ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-suisse text-[11px] sm:text-xs leading-relaxed text-[var(--brand-cream)]/80 pt-2 border-t border-white/10 mt-2">
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
    </div>
  );
}