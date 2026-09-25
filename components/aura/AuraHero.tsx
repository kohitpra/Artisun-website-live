'use client';

import { useRef, useState } from 'react';

import TagPills from '@/components/pdp/TagPills';
import PdpGallery from '@/components/pdp/PdpGallery';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';
import AddToBagButton from '@/components/cart/AddToBagButton';

const BADGES = ['SPF 40', 'PA++++', 'All weathers', '50gm'];

// GALLERY array me video add karein:
const GALLERY = [
  '/pdp/aura-1.webp',
  '/pdp/aura-2.webp',
  '/pdp/aura-4.webp',
  '/Aura video.mov', // <--- video file
  '/pdp/aura-3.webp',
  '/pdp/First page, sixth image.webp',
  '/pdp/aura-5.webp',
  '/pdp/Aura, seventh image.webp',
  '/pdp/aura-7.webp',
  '/pdp/aura-8.webp',
];

const FULL_INGREDIENTS =
  'Water, Ethylhexyl Methoxycinnamate, Propylene Glycol, Ethylhexyl Salicylate, ' +
  'Glycerin, C13-15 Alkane, Betaine, Camellia Sinensis Leaf Extract, Beta-Glucan, ' +
  'Bisabolol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Cetearyl Alcohol, ' +
  'Ceteareth-25, Lauric/Myristic/Palmitic/Stearic Glycerides, C14-22 Alcohols, ' +
  'Magnesium Aluminometasilicate, Palmitic Acid, Glyceryl Stearate, Stearic Acid, ' +
  'C12-20 Alkyl Glucoside, Xanthan Gum, Fragrance, Caprylhydroxamic Acid, Glyceryl Caprylate.';

type NavItem = { n: string; label: string; target: number | null; kind: 'link' | 'accordion' };

/**
 * "The specifics" and "Product buy" rows are removed.
 *
 * The AuraProduct PANEL still exists and still scrolls — only its nav row is
 * gone, as you asked. AuraStats is removed from the page entirely, so the panel
 * count drops 8 -> 7 and every target after it shifts down by one.
 */
const NAV_ITEMS: NavItem[] = [
  { n: '01', label: 'Why Aura', target: 1, kind: 'link' },       // AuraDosage
  { n: '02', label: 'How to wear', target: 2, kind: 'link' },      // AuraTexture
  { n: '03', label: 'How it feels', target: 3, kind: 'link' },    // AuraWhere
  { n: '04', label: "Where it works", target: 4, kind: 'link' },      // AuraWhatsIn
  { n: '05', label: "What's in it", target: 5, kind: 'link' },      // AuraWhatsIn
  { n: '06', label: 'Questions', target: 7, kind: 'link' },         // AuraQuestions
  { n: '07', label: 'Full ingredient list', target: null, kind: 'accordion' },
];

export default function AuraHero({ onNavigate }: { onNavigate: (panelIndex: number) => void }) {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Whole section (image + copy) scrolls vertically, then releases into the
  // horizontal track — the image is no longer pinned while only the text moves.
// usePanelEdgeScroll removed to prevent inner frame scroll

  return (
    <div className="aura-panel relative w-screen shrink-0 h-auto md:h-[100svh] lg:h-[100svh] overflow-visible md:overflow-hidden lg:overflow-hidden">
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      <div
        ref={scrollerRef}
        className="w-full h-full flex flex-col justify-center pt-20 pb-10 md:pt-20 md:pb-14 lg:pt-20 lg:pb-12"
      >
        <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:grid md:grid-cols-[minmax(380px,460px)_1fr] lg:grid-cols-[540px_1fr] xl:grid-cols-[580px_1fr] gap-3 sm:gap-6 md:gap-8 lg:gap-12 items-center my-auto">

          {/* ── TOP ON MOBILE / LEFT ON DESKTOP & TABLET: Product Visual ── */}
          <div className="order-1 flex flex-col w-full max-w-[360px] md:max-w-[460px] lg:max-w-[540px] xl:max-w-[580px] shrink-0 min-h-0">
            <PdpGallery
              images={GALLERY}
              alt="Aura Pearl Skinwear"
              frameClassName="aspect-square max-h-[70vh]"
              videoPoster="/pdp/aura-video-poster.webp"
            />
          </div>

          {/* ── CONTENT: right on desktop & tablet / bottom on mobile ── */}
          <div className="order-2 flex flex-col justify-center w-full max-w-[440px] md:max-w-none lg:max-w-[540px] gap-2 md:gap-3.5 lg:gap-2.5 py-0">
            {/* Visual Breadcrumb Navigation */}
            {/* <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/collection' },
                { label: 'Aura' },
              ]}
            /> */}

            {/* Outlined tag pills */}
            <TagPills tags={BADGES} className="mb-0" />

            {/* Primary H1 */}
            <h1 className="font-editorial text-[var(--brand-cream)] text-[21px] sm:text-[26px] md:text-[32px] lg:text-[34px] leading-[1.08] tracking-tight">
              Aura Pearl Sunscreen SPF 40 PA++++
            </h1>

            {/* Description weaving secondary keywords: broad spectrum sunscreen, sunscreen for dry skin, climate-smart sunscreen, pearl sunscreen, dewy finish sunscreen */}
            <div className="w-full font-suisse text-[var(--brand-cream)]/85 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[13.5px] leading-[1.4] md:leading-[1.45] mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
              <p className="text-[var(--brand-cream)] font-medium text-[12.5px] sm:text-[13px] md:text-[14px]">
                Pearls that melt into sun protection.
              </p>
              <p className="w-full text-left">
               An innovative pearl sunscreen with beads of broad-spectrum SPF, suspended in a barrier repairing gel — combining protection and skincare in one layer. They break on your skin, sink in with no white cast, and leave an invisible finish. For every skin type, easiest absorption ever.
              </p>
            </div>

            {/* Price + Buy */}
            <div className="flex items-center gap-3 sm:gap-4 my-1 md:my-2">
              <span className="font-editorial text-[var(--brand-cream)] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[26px]">₹1,799</span>
              <AddToBagButton
                product="aura"
                className="pointer-events-auto font-suisse text-[10px] sm:text-xs uppercase tracking-wide px-5 sm:px-6 md:px-7 py-2 md:py-2.5 bg-[var(--brand-cream)] text-[var(--brand-dark)] hover:bg-white transition-colors font-medium rounded-sm"
              />
            </div>

           

            {/* Sidebar Navigation */}
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                if (item.kind === 'accordion') {
                  return (
                    <li key={item.n} className="relative border-b border-[#E6D5C1]">
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
                  <li key={item.n} className="border-b border-[#E6D5C1]">
                    <button
                      onClick={() => item.target !== null && onNavigate(item.target)}
                      className="pointer-events-auto w-full flex items-center gap-3 py-1.5 sm:py-2 md:py-3 text-left group"
                    >
                      <span className="font-suisse text-[11.5px] sm:text-[13px] md:text-[14.5px] lg:text-[14px] text-[var(--brand-cream)]/90 group-hover:text-[var(--brand-cream)] transition-colors">
                        {item.label}
                      </span>
                      <span className="ml-auto text-[#E8DCC8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
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
