'use client';

import { useState, useMemo, useRef } from 'react';
import { usePanelEdgeScroll } from '@/hooks/usePanelEdgeScroll';

type QA = { q: string; a: string };
type Category = { label: string; items: QA[] };

const VISIBLE_COUNT = 4;

const CATEGORIES: Category[] = [
  {
    label: 'The basics',
    items: [
      {
        q: 'What is Aura?',
        a: 'Aura — full name Aura Pearl Skinwear — is a daily sunscreen with a difference: pearls of broad-spectrum protection suspended in a fresh, hydrating gel. You scoop a little with the spatula and the pearls melt into skin on contact. It gives SPF 40 and PA+++ protection, deep hydration, and a soft, dewy glow.',
      },
      {
        q: 'What is Skinwear?',
        a: 'Skinwear is our word for sun care you actually want to wear every day. The idea: what you put on your skin is “worn,” the way an outfit is — something you choose and enjoy, not a step you tolerate. So we design our sunscreens to feel and look good on the skin, which makes daily protection something you keep up instead of skip.',
      },
      {
        q: 'Why did we make Aura?',
        a: 'We wanted sun protection to feel as beautiful as it is effective. Most sunscreens trade comfort for protection — heavy, hard to layer, greasy by midday. Aura gives glow instead of grease: a gel-and-pearl formula you adjust to the weather, with protection that performs and a finish that flatters.',
      },
      {
        q: 'How is Aura different from Origin, and which should I choose?',
        a: "They do the same job — daily sun protection — in different forms and finishes. Origin is a light milk lotion (SPF 50+) that disappears into the skin; it's the everyday, no-finish one. Aura is a gel with SPF pearls (SPF 40, PA+++) that adds more hydration and leaves a soft, dewy glow. Choose Origin for the highest protection and an invisible finish; choose Aura for a glowy, hydrated look. Some keep both and pick by the day or the weather.",
      },
      {
        q: 'What makes Aura climate-smart?',
        a: "Most sunscreens are built around your skin type, but your skin shifts with the weather — oilier in humidity, drier in winter. Aura is built for exactly that: you adjust how many pearls you use to the weather. Around 2 pearls on hot, humid days; up to 3 on cold, dry winter days; 1–2 through the monsoon. The same protection, tuned to the day you're actually having. That's what climate-smart means.",
      },
      {
        q: 'What size is Aura, and how long does it last?',
        a: 'Aura comes in a 50 g glass jar. Using around two pearls on the face and neck each morning, it lasts roughly a month.',
      },
    ],
  },
  {
    label: 'Protection',
    items: [
      {
        q: 'How much sun protection does Aura give?',
        a: 'Aura is SPF 40 and PA++++. The SPF 40 blocks up to 97% of UVB — the rays that burn and darken skin — and PA+++ covers UVA, the rays behind ageing and pigmentation. So it protects against both.',
      },
      {
        q: 'Is SPF 40 enough for everyday protection?',
        a: "Yes. SPF 40 blocks around 97% of UVB rays — plenty for daily life, commuting, and time indoors. If you'll be out in strong sun for hours, Origin's SPF 50+ gives a little more headroom, but for most days SPF 40 with PA++++ is solid — and its UVA filter stays stable for up to 8 hours.",
      },
      {
        q: 'What does PA+++ mean?',
        a: 'PA is the rating for UVA protection — the rays behind ageing, dark spots, and long-term damage. It runs from PA+ to PA++++. Aura is PA++++, strong UVA protection, built with Uvinul A Plus, one of the most advanced UVA filters in the world.',
      },
      {
        q: 'Is the SPF real and independently tested?',
        a: "Yes. Aura's SPF 40 and PA++++ are measured in an accredited lab, not estimated. The numbers on the jar are the tested numbers.",
      },
      {
        q: 'Does Aura help with tanning and pigmentation?',
        a: "Yes, by preventing more of it. Tanning and dark spots come from UV exposure, and Aura's SPF 40 / PA+++ blocks most of that, so worn every day it helps stop new tanning and pigmentation from forming. It protects — it won't lighten spots you already have.",
      },
      {
        q: 'Does Aura protect against pollution?',
        a: "Yes. Aura's ectoin forms a hydration shell around skin cells that helps shield them from pollution, heat, and environmental stress, and the formula is shown to reduce pollution-induced skin damage by up to 40%. Made for real Indian city air.",
      },
      {
        q: 'Do I need Aura indoors, on cloudy days, or near screens?',
        a: "Yes on cloudy days, and yes if you sit near a window. UVA rays pass through clouds and glass, so your skin is still exposed to daylight indoors. Screens give off very little UV, so they aren't a real concern — but daylight through a window is, which is why it's worth wearing every morning.",
      },
    ],
  },
  {
    label: 'Finish & weather',
    items: [
      {
        q: 'Will Aura leave a white cast?',
        a: 'No — zero white cast, on any Indian skin tone. Aura has no zinc or titanium, and the pearls melt in completely clear. Tested on deep, medium, and fair skin: no grey, no chalk.',
      },
      {
        q: 'What kind of finish does Aura give?',
        a: "A soft, dewy glow — lit-from-within, not shiny or glittery. There's no shimmer or sparkle in it. It's the fresh, hydrated look of a good K-beauty step, built into your sun protection — a second-skin finish that amplifies your natural glow.",
      },
      {
        q: 'Is Aura greasy, or is that the glow?',
        a: "That's glow, not grease. Aura is a light gel that leaves a dewy, hydrated finish — never oily or heavy. It's actually made for people who feel greasy in their current sunscreen. If you have very oily skin and prefer a matte look, Origin will suit you better.",
      },
      {
        q: 'Does the glow last, and does Aura hold up through the day?',
        a: "Yes. Worn in the morning, it holds through a normal day — the finish settles into the skin and stays comfortable, and the UVA filter stays photostable for up to 8 hours. If you're out in strong sun, reapply every 2–3 hours.",
      },
      {
        q: 'Will Aura pill or feel heavy?',
        a: "No pilling. Aura is tested to layer cleanly under makeup — it melts in and sits like second skin, no balling, no rolling. It won't feel heavy either.",
      },
    ],
  },
  {
    label: 'Ingredients & skin',
    items: [
      {
        q: "What's in Aura? (full ingredient list)",
        a: "Aura is a hydrating gel with SPF pearls. The sun protection comes from three UV filters (ethylhexyl methoxycinnamate, ethylhexyl salicylate, and diethylamino hydroxybenzoyl hexyl benzoate / Uvinul A Plus), and the hydration from sodium hyaluronate and ectoin.\n\nFull list:\nWater, Ethylhexyl Methoxycinnamate, Ethylhexyl Palmitate, Glycerin, Ethylhexyl Salicylate, C13-15 Alkane, Sodium Hyaluronate, Propylene Glycol, Cetearyl Alcohol, Polysorbate 60, Sorbitan Stearate, Glyceryl Stearate, PEG-100 Stearate, Glyceryl Acrylate/Acrylic Acid Copolymer, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Beta-Glucan, Ectoin, Hydroxyacetophenone, 1,2-Hexanediol, Bisabolol, Polyacrylic Acid, Carbomer, Triethanolamine, Chlorphenesin, Sorbitan Oleate, Trideceth-9, Fragrance.",
      },
      {
        q: 'What are the key ingredients, and what do they do?',
        a: "A few do the real work, each sourced from where it's made best:\n\n• Ectoin (Germany) — a K-beauty hero that deeply hydrates (up to a 3x moisture boost) and shields skin from heat, pollution, and UV stress.\n• Hyaluronic acid (sodium hyaluronate) — pulls water into the skin and holds it, for a plump, dewy softness. It's the reason Aura finishes the way it does.\n• Bisabolol (from chamomile) — calms redness and keeps the finish even.\n• Uvinul A Plus (Germany) — one of the world's most advanced UVA filters, photostable for up to 8 hours.\n\nWorld-class actives, the kind rarely seen together in Indian sun care.",
      },
      {
        q: 'Is Aura a chemical or mineral sunscreen?',
        a: "Chemical. Aura uses three chemical UV filters, not mineral ones like zinc or titanium — which is part of why it melts in clear with no white cast. (Chemical here just means the filter type; it doesn't mean harsh.)",
      },
      {
        q: 'Is Aura fragrance-free?',
        a: 'No. Aura has a very light fragrance — the same light one in Origin — so it isn’t fragrance-free. If your skin is sensitive to fragrance, do a patch test first.',
      },
      {
        q: 'Does Aura contain any drying alcohol?',
        a: 'No. There’s no drying alcohol — the kind listed as alcohol denat. or SD alcohol — in Aura.',
      },
      {
        q: 'Will Aura clog pores?',
        a: 'No — Aura is non-comedogenic and irritation-safe, tested for both. It’s a light gel with no heavy oils and no harsh additives, so it won’t clog pores.',
      },
      {
        q: 'Is Aura vegan and cruelty-free?',
        a: 'Yes. Aura is vegan and not tested on animals.',
      },
      {
        q: 'Is Aura good for dry or dehydrated skin?',
        a: 'Very well. Aura is built around hydration — hyaluronic acid and ectoin pull water into the skin and hold it there (up to a 3x moisture boost), and beta-glucan keeps it comfortable. If your skin feels tight or looks dull, Aura’s dewy finish is made for it.',
      },
      {
        q: 'Is Aura okay for oily skin?',
        a: 'It can be, but it’s a dewy finish, so if you have very oily skin and prefer matte, Origin will suit you better. If you like a glow, Aura works fine — use a thin layer.',
      },
      {
        q: 'Is Aura okay for sensitive skin?',
        a: 'Yes. Aura is irritation-safe (tested) and built with soothing ectoin, beta-glucan, and bisabolol — it’s shown to reduce skin sensitivity over time. It does contain a light fragrance and chemical UV filters, so if you have a known fragrance sensitivity, patch test on your inner arm for a couple of days first.',
      },
      {
        q: 'Can I use Aura during pregnancy or breastfeeding?',
        a: 'It should be fine, but check with your doctor first. Aura is a chemical sunscreen, and some people prefer mineral ones during pregnancy, so it’s best to run it past your doctor before adding anything new.',
      },
    ],
  },
  {
    label: 'Using & delivery',
    items: [
      {
        q: 'How do I use Aura?',
        a: 'Using the spatula, take about 2–3 pearls and spread them evenly over your face and neck before sun. They melt on contact into a smooth, protective layer. Reapply every 2–3 hours when you’re outdoors, or after sweating or towel-drying. Wear it alone for a dewy finish, or under makeup.',
      },
      {
        q: 'How many pearls should I use?',
        a: 'It depends on the weather — that’s part of how Aura works. Around 2 pearls on hot, humid days, up to 3 on cold, dry winter days, and 1–2 through the monsoon. Each of these gives you the full, tested SPF 40 — just cover your face and neck evenly.',
      },
      {
        q: 'Can I use Aura with actives like retinol, vitamin C, or AHAs?',
        a: 'Yes. Keep your actives in their usual place — vitamin C in the morning, retinol or AHAs at night — and wear Aura last in the morning, once they’ve absorbed. Its hydrating, soothing ingredients (ectoin, beta-glucan, bisabolol) actually help keep skin comfortable when you’re using stronger actives.',
      },
      {
        q: 'Do I still need a moisturiser under Aura?',
        a: 'Usually not. Aura is very hydrating on its own — hyaluronic acid and ectoin do the work of a hydrating step. If your skin is very dry, you can still wear a moisturiser first, let it settle, then Aura on top.',
      },
      {
        q: 'Can I wear Aura under makeup?',
        a: 'Yes. Its dewy finish makes a lovely base — wear it as your last skincare step, let it settle for a minute, then do your makeup over it. It’s tested to layer cleanly, so it won’t pill under foundation.',
      },
      {
        q: 'Can I use Aura on my body?',
        a: 'Yes. It works anywhere that’s exposed — just scoop enough to cover the area evenly.',
      },
      {
        q: 'Can I wear Aura at night?',
        a: 'There’s no need. Sunscreen protects against daylight, so wear it in the morning. At night you can skip it.',
      },
      {
        q: 'How is Aura packaged, and why?',
        a: 'Aura comes in a glass jar with a spatula and a lid. The glass keeps the formula stable and feels better than plastic. The spatula matters more than it looks: scooping with it instead of your fingers keeps bacteria out of the jar, so what’s inside stays clean and lasts well. Close the lid between uses.',
      },
      {
        q: 'How should I store Aura, and what’s its shelf life?',
        a: 'Keep it somewhere cool, out of direct sunlight, with the lid closed. Unopened, it stays good for 18 months.',
      },
      {
        q: 'How much is Aura, and how long does delivery take?',
        a: 'Aura is ₹1,799 for a 50 g jar. Orders are delivered in 3 to 5 working days.',
      },
      {
        q: 'What is your returns policy?',
        a: 'We only take returns if the item reaches you damaged, defective, or wrong. Opened or used items can’t be returned, and the sunscreen not suiting your skin isn’t a reason for return. If your order arrives damaged or with something missing, contact support within 48 hours with photos and an unboxing video. Approved cases get a replacement or store credit.',
      },
    ],
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[var(--brand-cream)]' : 'text-[var(--brand-cream)]/50'}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function AuraQuestions() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [expandedTabs, setExpandedTabs] = useState<Record<number, boolean>>({});
  const scrollerRef = useRef<HTMLDivElement>(null);
  usePanelEdgeScroll(scrollerRef);

  const isSearching = search.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = search.trim().toLowerCase();
    const results: { item: QA; category: string }[] = [];
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((it) => {
        if (it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)) {
          results.push({ item: it, category: cat.label });
        }
      });
    });
    return results;
  }, [search, isSearching]);

  const activeCategory = CATEGORIES[tab];
  const isExpanded = expandedTabs[tab] || false;
  const visibleItems = isExpanded
    ? activeCategory.items
    : activeCategory.items.slice(0, VISIBLE_COUNT);

  return (
    <div
      id="aura-questions"
      className="aura-panel relative w-screen shrink-0 h-[100svh] flex flex-col items-center justify-center pt-[76px] pb-24 sm:pt-24 sm:pb-24 lg:py-0 overflow-hidden pointer-events-auto"
    >
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      <div className="w-full max-w-[920px] mx-auto px-4 sm:px-8 lg:px-12 my-auto flex flex-col justify-center max-h-[calc(100svh-140px)] lg:max-h-[84vh]">
        {/* Eyebrow + Heading */}
        <span className="self-center font-suisse text-[11px] tracking-[0.24em] uppercase text-white/70 font-medium">
          FAQS
        </span>
        
        <h2 className="self-center font-editorial text-white text-[32px] sm:text-[42px] lg:text-[48px] leading-tight mt-2 text-center not-italic">
          Everything, answered.
        </h2>

        {/* Search Bar */}
        <div className="w-full max-w-[540px] mx-auto mt-5 sm:mt-6">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(null);
            }}
            placeholder="Search a question — pearls, glow, fragrance, Origin vs Aura…"
            className="w-full font-suisse text-[16px] sm:text-[13px] px-5 py-2.5 sm:py-3 rounded-full bg-white/[0.07] border border-[var(--brand-cream)]/20 text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/40 focus:outline-none focus:border-[var(--brand-red)] focus:bg-white/[0.12] transition-all text-center focus:text-left shadow-inner"
          />
        </div>


{/* Category Tabs: Centered and smooth scrolling */}
        {!isSearching && (
          <div className="mt-4 sm:mt-6 lg:mt-7 border-t border-b border-[var(--brand-cream)]/15 shrink-0">
            <div className="flex items-center justify-start sm:justify-center gap-x-3.5 sm:gap-x-6 lg:gap-x-7 py-2.5 sm:py-3 overflow-x-auto [scrollbar-width:none] flex-nowrap">
              {CATEGORIES.map((c, i) => {
                const active = i === tab;
                return (
                  <button
                    key={c.label}
                    onClick={() => {
                      setTab(i);
                      setOpen(null);
                    }}
                    className={`pointer-events-auto shrink-0 flex items-center gap-1.5 font-suisse text-[10.5px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.14em] uppercase transition-colors whitespace-nowrap ${
                      active
                        ? 'text-[var(--brand-cream)] font-medium'
                        : 'text-[var(--brand-cream)]/45 hover:text-[var(--brand-cream)]/80'
                    }`}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)] shadow-[0_0_6px_var(--brand-red)] shrink-0" />}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Accordion Questions List with smooth isolated scroll */}
        <div
          ref={scrollerRef}
          className="panel-scroll mt-2 flex-1 flex flex-col min-h-0 pr-1.5 sm:pr-2 pb-6"
        >


          <div className="divide-y divide-[var(--brand-cream)]/12">
            {!isSearching &&
              visibleItems.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="transition-colors">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="pointer-events-auto w-full flex items-center justify-between gap-4 py-3.5 sm:py-4 text-left text-[var(--brand-cream)] group"
                    >
                      <span className="font-editorial text-[15px] sm:text-[17px] lg:text-[19px] tracking-tight group-hover:text-white transition-colors flex-1">
                        {item.q}
                      </span>
                      <Chevron open={isOpen} />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-[350ms] ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="font-suisse text-[13px] sm:text-[14px] leading-[1.65] text-white/80 pb-4 pr-2 whitespace-pre-line w-full">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {isSearching &&
              searchResults.map((res, i) => {
                const isOpen = open === i;
                return (
                  <div key={res.item.q} className="transition-colors">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="pointer-events-auto w-full flex items-center justify-between gap-4 py-3.5 sm:py-4 text-left text-[var(--brand-cream)] group"
                    >
                      <div>
                        <span className="block font-suisse text-[9.5px] uppercase tracking-widest text-[var(--brand-cream)]/60 mb-0.5">
                          {res.category}
                        </span>
                        <span className="font-editorial text-[15px] sm:text-[17px] lg:text-[19px] tracking-tight group-hover:text-white transition-colors">
                          {res.item.q}
                        </span>
                      </div>
                      <Chevron open={isOpen} />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-[350ms] ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="font-suisse text-[13px] sm:text-[14px] leading-[1.65] text-[var(--brand-cream)]/75 pb-4 pr-4 sm:pr-8 whitespace-pre-line max-w-[70ch]">
                          {res.item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {isSearching && searchResults.length === 0 && (
              <div className="text-center py-10">
                <p className="font-suisse text-xs sm:text-sm text-[var(--brand-cream)]/50">
                  No questions match &ldquo;{search}&rdquo;. Try another keyword.
                </p>
              </div>
            )}
          </div>

          {/* View All Button — safely inside scrollable container */}
          {!isSearching && !isExpanded && activeCategory.items.length > VISIBLE_COUNT && (
            <button
              onClick={() => setExpandedTabs((prev) => ({ ...prev, [tab]: true }))}
              className="pointer-events-auto self-center mt-5 mb-4 shrink-0 font-suisse text-[11px] sm:text-[12px] tracking-[0.14em] uppercase px-6 sm:px-7 py-2 sm:py-2.5 rounded-full border border-[var(--brand-cream)]/30 text-[var(--brand-cream)]/90 hover:bg-[var(--brand-cream)] hover:text-[var(--brand-dark)] transition-all"
            >
              View all {activeCategory.items.length} questions
            </button>
          )}
        </div>

      </div>
    </div>
  );
}