'use client';

import { useRef, useState } from 'react';

import TagPills from '@/components/pdp/TagPills';
import PdpGallery from '@/components/pdp/PdpGallery';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';
import AddToBagButton from '@/components/cart/AddToBagButton';

const BADGES = ['SPF 50+', 'PA++++', 'All Weathers', '50ml'];

// Four distinct ORIGIN product shots for the gallery.
const GALLERY = [
  '/pdp/origin-1.webp',
  '/pdp/origin-2.webp',
  '/Origion web imge.png',
  '/originhero.mp4',
  '/pdp/First page, fifth picture.webp',
  '/pdp/origin-3.webp',
  '/pdp/origin-4.webp',
  '/pdp/First page, fifth picture (1).webp',
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

  return (
    <div className="origin-panel relative w-screen shrink-0 h-auto md:h-[100svh] lg:h-[100svh] overflow-visible md:overflow-hidden lg:overflow-hidden">
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {/* Mobile only: bridge the header into the panel.
          var(--bg-eclipse) is near-black at the top (its red center is at 80vh),
          so we overlay a red→transparent fade over the top ~100px to match the
          header colour and eliminate the visible dark gap. */}
      <div
        className="absolute top-0 left-0 right-0 h-24 md:hidden lg:hidden pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(180,30,10,0.95) 0%, rgba(140,10,5,0.6) 40%, transparent 100%)',
          zIndex: 0,
        }}
      />

      {/* Scroller: on mobile the section scrolls vertically (with room to clear
          the sticky bar); on desktop it's a centred, non-scrolling grid. */}
      <div
        ref={scrollerRef}
        className="panel-scroll md:overflow-hidden lg:overflow-hidden w-full h-full flex flex-col justify-start md:justify-center lg:justify-center pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-20 md:pb-14 lg:py-0"
      >
        <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:grid md:grid-cols-[minmax(380px,460px)_1fr] lg:grid lg:grid-cols-[540px_1fr] xl:grid-cols-[580px_1fr] gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center my-auto">

          {/* ── TOP ON MOBILE / LEFT ON DESKTOP & TABLET: Product Visual ── */}
<div className="order-1 flex flex-col w-full max-w-[360px] md:max-w-[460px] lg:max-w-[540px] xl:max-w-[580px] shrink-0 min-h-0">
  <PdpGallery
    images={GALLERY}
    alt="Origin 4-in-1 Milk Emulsion"
    frameClassName="aspect-square max-h-[70vh]"
    videoPoster="/pdp/origin-1.webp"
  />
</div>

          {/* ── BOTTOM ON MOBILE / RIGHT ON DESKTOP & TABLET: Info & Compact Navigation Copy ── */}
          <div className="order-2 flex flex-col justify-center w-full max-w-[440px] md:max-w-none lg:max-w-[540px] gap-2 md:gap-3.5 lg:gap-2.5 py-0">
            {/* Visual Breadcrumb Navigation */}
            {/* <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/collection' },
                { label: 'Origin' },
              ]}
            /> */}

            {/* Outlined tag pills */}
            <TagPills tags={BADGES} className="mb-0" />

            {/* Primary H1 */}
            <h1 className="font-editorial text-[var(--brand-cream)] text-[21px] sm:text-[26px] md:text-[32px] lg:text-[34px] leading-[1.08] tracking-tight">
              Origin 4-in-1 Milk Sunscreen SPF 50+
            </h1>

            {/* Description weaving secondary keywords: sunscreen for oily skin, broad spectrum sunscreen, lightweight sunscreen, sunscreen serum, no white cast */}
            <div className="w-full font-suisse text-[var(--brand-cream)]/85 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13.5px] leading-[1.4] md:leading-[1.45] mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
              <p className="text-[var(--brand-cream)] font-medium text-[12.5px] sm:text-[13px] md:text-[14px]">
                Four steps, done in one light layer.
              </p>
              <p className="w-full text-left">
                Origin is a lightweight broad spectrum sunscreen serum that does four jobs at once — serum, moisturiser, SPF 50+ sunscreen, and primer. An ultra-light milk sunscreen for oily skin and all Indian weather, it absorbs weightlessly with no white cast.
              </p>
            </div>

            {/* Price + Buy */}
            <div className="flex items-center gap-3 sm:gap-4 my-1 md:my-2">
              <span className="font-editorial text-[var(--brand-cream)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[26px]">₹1499</span>
              <AddToBagButton
                product="origin"
                className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 md:px-7 py-2 md:py-2.5 bg-[var(--brand-cream)] text-[var(--brand-dark)] hover:bg-white transition-colors font-medium rounded-sm"
              />
            </div>

            {/* <div className="h-px w-full bg-[#E8DCC8]/25 my-0.5" /> */}

            {/* Sidebar Navigation */}
            <ul className="flex flex-col border-b border-[#E6D5C1]">
              {NAV_ITEMS.map((item) => {
                const soon = item.kind === 'link' && item.target === null;

                if (item.kind === 'accordion') {
                  return (
                    <li key={item.n} className="relative border-t first:border-t-0 border-[#E6D5C1]">
                      <button
                        onClick={() => setIngredientsOpen((v) => !v)}
                        aria-expanded={ingredientsOpen}
                        className="pointer-events-auto w-full flex items-center gap-2 sm:gap-3 py-1.5 md:py-3 text-left group"
                      >
                        <span className="font-suisse text-[11.5px] sm:text-[12.5px] lg:text-[13.5px] text-[var(--brand-cream)]/90 group-hover:text-[var(--brand-cream)] transition-colors">
                          {item.label}
                        </span>
                        <span className={`ml-auto text-sm text-[#E8DCC8] transition-transform duration-300 ${ingredientsOpen ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      
                      {/* Bottom-anchored popover to prevent clipping at screen edge */}
                      <div
                        className={`absolute left-0 right-0 bottom-full mb-2 z-50 origin-bottom transition-[opacity,transform] duration-200 ease-out ${
                          ingredientsOpen
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <div className="bg-[#120403]/95 backdrop-blur-xl border border-[#E6D5C1]/20 shadow-2xl rounded-lg p-3.5">
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E6D5C1]/10">
                            <span className="font-suisse text-[11px] uppercase tracking-wider text-[var(--brand-cream)] font-medium">Full Ingredients</span>
                            <button onClick={() => setIngredientsOpen(false)} className="text-[#E8DCC8]/60 hover:text-[#E8DCC8] text-xs">✕</button>
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
                  <li key={item.n} className="border-t first:border-t-0 border-[#E6D5C1]">
                    <button
                      disabled={soon}
                      onClick={() => item.target !== null && onNavigate(item.target)}
                      className={`pointer-events-auto w-full flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 md:py-3 text-left group ${soon ? 'cursor-default' : ''}`}
                    >
                      <span className={`font-suisse text-[11.5px] sm:text-[13px] lg:text-[14px] transition-colors ${soon ? 'text-[var(--brand-cream)]/35' : 'text-[var(--brand-cream)]/90 group-hover:text-[var(--brand-cream)]'}`}>
                        {item.label}
                      </span>

                      {soon ? (
                        <span className="ml-auto font-suisse text-[10px] uppercase tracking-wider text-[#E8DCC8]/40 border border-[#E8DCC8]/20 rounded-full px-2 py-0.5">Soon</span>
                      ) : (
                        <span className="ml-auto text-[#E8DCC8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8DCC8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
