'use client';

import { useRef, useState } from 'react';

import TagPills from '@/components/pdp/TagPills';
import PdpGallery from '@/components/pdp/PdpGallery';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';
import AddToBagButton from '@/components/cart/AddToBagButton';

const BADGES = ['SPF 50+', 'PA++++', 'All Weathers', '50ml'];

// Four distinct ORIGIN product shots for the gallery.
const GALLERY = [
  '/pdp/origin-1.webp',
  '/pdp/origin-2.webp',
  '/pdp/First page, third image.webp',
  '/pdp/origin-3.webp',
  '/pdp/origin-4.webp',
  '/pdp/First page, fifth picture (1).webp',
  '/pdp/First page, fifth picture.webp',
  '/pdp/First page, eighth picture.webp',
];

const FULL_INGREDIENTS =
  'Water, Ethylhexyl Methoxycinnamate, Propylene Glycol, Ethylhexyl Salicylate, ' +
  'Glycerin, C13-15 Alkane, Betaine, Camellia Sinensis Leaf Extract, Beta-Glucan, ' +
  'Bisabolol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Cetearyl Alcohol, ' +
  'Ceteareth-25, Lauric/Myristic/Palmitic/Stearic Glycerides, C14-22 Alcohols, ' +
  'Magnesium Aluminometasilicate, Palmitic Acid, Glyceryl Stearate, Stearic Acid, ' +
  'C12-20 Alkyl Glucoside, Xanthan Gum, Fragrance, Caprylhydroxamic Acid, Glyceryl Caprylate.';

type NavItem = { n: string; label: string; target: number | null; kind: 'link' | 'accordion' };
const NAV_ITEMS: NavItem[] = [
  { n: '01', label: 'Why Origin', target: 1, kind: 'link' },
  { n: '02', label: 'Where it works', target: 2, kind: 'link' },
  { n: '03', label: "What's in it", target: 3, kind: 'link' },
  { n: '04', label: 'Questions', target: 5, kind: 'link' },
  { n: '05', label: 'Full ingredient list', target: null, kind: 'accordion' },
];

export default function OriginHero({ onNavigate }: { onNavigate: (panelIndex: number) => void }) {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Whole-section vertical scroll (image + copy together) that releases into the
  // horizontal track at the edges. Inert on desktop where everything fits.
  usePanelEdgeScroll(scrollerRef);

  return (
    <div className="origin-panel relative w-screen shrink-0 h-[100svh] overflow-hidden">
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {/* Scroller: on mobile the section scrolls vertically (with room to clear
          the sticky bar); on desktop it's a centred, non-scrolling grid. */}
      <div
        ref={scrollerRef}
        className="panel-scroll lg:overflow-hidden h-full flex flex-col justify-start lg:justify-center pt-[76px] pb-24 sm:pt-24 sm:pb-24 lg:py-0"
      >
        <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:grid lg:grid-cols-[540px_1fr] xl:grid-cols-[580px_1fr] gap-5 sm:gap-6 lg:gap-12 items-center my-auto">

          {/* ── TOP ON MOBILE / LEFT ON DESKTOP: Product Visual ── */}
          <div className="order-1 flex flex-col w-full max-w-[360px] lg:max-w-[540px] xl:max-w-[580px] shrink-0 min-h-0">
            <PdpGallery
              images={GALLERY}
              alt="Origin 4-in-1 Milk Emulsion"
              frameClassName="aspect-square max-h-[70vh]"
            />
          </div>

          {/* ── BOTTOM ON MOBILE / RIGHT ON DESKTOP: Info & Compact Navigation Copy ── */}
          <div className="order-2 flex flex-col justify-center w-full max-w-[440px] lg:max-w-[540px] gap-2 lg:gap-2.5 py-0">
            {/* Outlined tag pills — matches your reference */}
            <TagPills tags={BADGES} className="mb-0" />

            {/* Title */}
            <h1 className="font-editorial text-[var(--brand-cream)] text-[21px] sm:text-[26px] lg:text-[34px] leading-[1.08] tracking-tight">
              ORIGIN&nbsp;·&nbsp;4-in-1 Milk Emulsion SPF&nbsp;50+
            </h1>

            {/* Description */}
            <div className="w-full font-suisse text-[var(--brand-cream)]/85 text-[12px] sm:text-[13px] lg:text-[13.5px] leading-[1.4] mt-0.5 space-y-0.5">
              <p className="text-[var(--brand-cream)] font-medium text-[12.5px] sm:text-[13px]">
                Four steps, done in one.
              </p>
              <p className="w-full text-left">
                Origin is a milk-light layer sunscreen that does four jobs at once — serum, moisturiser, sunscreen and primer. It goes on weightless, absorbs in seconds, and sits invisibly under everything else.
              </p>
            </div>

            {/* Price + Buy */}
            <div className="flex items-center gap-3 sm:gap-4 my-1">
              <span className="font-editorial text-[var(--brand-cream)] text-[18px] sm:text-[22px] lg:text-[26px]">₹1499</span>
              <AddToBagButton
                product="origin"
                className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 py-2 bg-[var(--brand-cream)] text-[var(--brand-dark)] hover:bg-white transition-colors font-medium rounded-sm"
              />
            </div>

            <div className="h-px w-full bg-[var(--brand-cream)]/15 my-0.5" />

            {/* Sidebar Navigation */}
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const soon = item.kind === 'link' && item.target === null;

                if (item.kind === 'accordion') {
                  return (
                    <li key={item.n} className="relative border-b border-[var(--brand-cream)]/10">
                      <button
                        onClick={() => setIngredientsOpen((v) => !v)}
                        aria-expanded={ingredientsOpen}
                        className="pointer-events-auto w-full flex items-center gap-2 sm:gap-3 py-1.5 text-left group"
                      >
                        <span className="font-suisse text-[11.5px] sm:text-[12.5px] lg:text-[13.5px] text-[var(--brand-cream)]/90 group-hover:text-[var(--brand-cream)] transition-colors">
                          {item.label}
                        </span>
                        <span className={`ml-auto text-sm text-[var(--brand-cream)]/60 transition-transform duration-300 ${ingredientsOpen ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      
                      {/* Bottom-anchored popover to prevent clipping at screen edge */}
                      <div
                        className={`absolute left-0 right-0 bottom-full mb-2 z-50 origin-bottom transition-[opacity,transform] duration-200 ease-out ${
                          ingredientsOpen
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <div className="bg-[#120403]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg p-3.5">
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                            <span className="font-suisse text-[11px] uppercase tracking-wider text-[var(--brand-cream)] font-medium">Full Ingredients</span>
                            <button onClick={() => setIngredientsOpen(false)} className="text-white/60 hover:text-white text-xs">✕</button>
                          </div>
                          <p className="font-suisse text-[10.5px] sm:text-[11.5px] leading-[1.5] text-[var(--brand-cream)]/85 max-h-[26vh] overflow-y-auto pr-1">
                            {FULL_INGREDIENTS}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.n} className="border-b border-[var(--brand-cream)]/10">
                    <button
                      disabled={soon}
                      onClick={() => item.target !== null && onNavigate(item.target)}
                      className={`pointer-events-auto w-full flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 text-left group ${soon ? 'cursor-default' : ''}`}
                    >
                      <span className={`font-suisse text-[11.5px] sm:text-[13px] lg:text-[14px] transition-colors ${soon ? 'text-[var(--brand-cream)]/35' : 'text-[var(--brand-cream)]/90 group-hover:text-[var(--brand-cream)]'}`}>
                        {item.label}
                      </span>

                      {soon ? (
                        <span className="ml-auto font-suisse text-[10px] uppercase tracking-wider text-[var(--brand-cream)]/30 border border-[var(--brand-cream)]/15 rounded-full px-2 py-0.5">Soon</span>
                      ) : (
                        <span className="ml-auto text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
