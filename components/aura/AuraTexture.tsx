'use client';

import Image from 'next/image';
import { asset } from '@/lib/asset';

export default function AuraTexture() {
  return (
    <div
      id="aura-texture"
      className="aura-panel relative w-screen shrink-0 h-[100svh] overflow-hidden text-[var(--brand-cream)]"
    >
      {/* ── Top on Mobile / Left on Desktop: Product Image ── */}
      <div className="absolute top-0 left-0 w-full h-1/2 lg:w-1/2 lg:h-full overflow-hidden bg-[#120302]">
        <Image
          src={asset('/pdp/aura-texture-1.webp')}
          alt="Aura Product"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>

      {/* ── Bottom on Mobile / Right on Desktop: Liquid Gel Texture Image ── */}
      <div className="absolute bottom-0 left-0 lg:top-0 lg:left-auto lg:right-0 w-full h-1/2 lg:w-1/2 lg:h-full overflow-hidden bg-[#120302]">
        <Image
          src={asset('/Third page, second image.webp')}
          alt="Aura Texture"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* ── Center Divider Line (Horizontal on Mobile / Vertical on Desktop) ── */}
      <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 lg:top-0 lg:left-1/2 lg:w-px lg:h-full lg:-translate-x-1/2 lg:translate-y-0 bg-white/20 z-20 pointer-events-none" />

      {/* ── Center Container: Exact Heading & Description ── */}
      <div className="relative z-30 h-full w-full flex flex-col items-center justify-center pointer-events-none px-6 sm:px-12">

        {/* Centered Eyebrow Label directly above heading */}
        <span className="font-suisse text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[var(--brand-cream)]/75 font-medium mb-3 sm:mb-4 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          HOW IT FEELS
        </span>

        {/* Exact Center Heading */}
        <h2 className="font-editorial text-[clamp(24px,4vw,56px)] leading-[1.08] text-white tracking-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] max-w-[900px]">
          Pillows of gel that vanish<br />
          the second they touch skin.
        </h2>

        {/* Subtext: Perfectly aligned 3 lines parallel to heading */}
        <div className="w-full max-w-[900px] mt-2 lg:mt-3 flex justify-center px-4">
          <p className="font-suisse text-[12.5px] sm:text-[14px] lg:text-[17px] leading-[1.4] lg:leading-[1.6] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center max-w-[300px] sm:max-w-[360px] lg:max-w-[48ch]">
            Our texture shifts from fluid to plush as you<br />
            smooth it on, then disappears into skin. No<br />
            heaviness. No grease. No film sitting on top.
          </p>
        </div>
      </div>
    </div>
  );
}