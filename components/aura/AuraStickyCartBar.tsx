'use client';

import Image from 'next/image';
import { asset } from '@/lib/asset';
import AddToBagButton from '@/components/cart/AddToBagButton';

export default function AuraStickyCartBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-11 sm:h-12 z-[60] bg-black/20 backdrop-blur-md border-t border-white/10 pointer-events-auto transition-all">
      <div className="h-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between">
        {/* Left: Compact Thumb + Title */}
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden shrink-0 border border-white/15">
            <Image src={asset('/pdp/aura-1.webp')} alt="Aura" fill sizes="32px" className="object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-[var(--brand-cream)] text-sm sm:text-base leading-none tracking-wide">
              AURA
            </span>
            <span className="hidden md:inline font-suisse text-[10px] text-[var(--brand-cream)]/50 tracking-[0.14em] uppercase">
              · Pearl Skinwear SPF 40 · 50g
            </span>
          </div>
        </div>

        {/* Right: Sleek Price + Clean Minimal Button */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="font-editorial text-[var(--brand-cream)] text-sm sm:text-base">
            ₹1,799
          </span>
          <AddToBagButton
            product="aura"
            className="font-suisse text-[10px] sm:text-[11px] uppercase tracking-[0.14em] px-4 sm:px-5 py-1.5 bg-[var(--brand-cream)] text-[var(--brand-dark,#1a1a1a)] font-medium hover:bg-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
}