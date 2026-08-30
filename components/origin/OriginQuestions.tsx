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
        q: 'What is Origin?',
        a: 'Origin is a daily sunscreen — a light, milky lotion with SPF 50+ and PA++++. You wear it every morning as the last step before makeup. It protects your skin from the sun, adds a little hydration, and sinks in without leaving a white cast or a greasy feel.',
      },
      {
        q: 'What is Skinwear?',
        a: 'Skinwear is our word for sun care you actually want to wear every day. The idea: what you put on your skin is “worn,” the way an outfit is — something you choose and enjoy, not a step you tolerate. So we design our sunscreens to feel and look good on the skin, which makes daily protection something you keep up instead of skip.',
      },
      {
        q: 'Why did we make Origin?',
        a: "Mornings had too many steps — a serum, a moisturiser, a sunscreen, a primer, all before you're out the door. We wanted to simplify that without giving up protection, so Origin folds those four into one light layer that hydrates, protects, and preps skin for makeup, and holds up across every Indian season. What you wear every day, made easy.",
      },
      {
        q: 'What makes Origin climate-smart?',
        a: "Most sunscreens are built around your skin type — oily, dry, sensitive. The catch is that your skin doesn't stay one type: it turns oilier in humidity, drier in winter, sweatier in peak summer. A formula built for one fixed skin type often stops working when the weather changes.\n\nSo we build around the weather instead. Origin is made and tested to hold up across India's full range — dry summers, sticky monsoons, polluted evenings, Diwali smog, December fog — so it stays comfortable and keeps working as conditions shift, not only in the weather it was designed for. That's what climate-smart means.",
      },
      {
        q: 'What does “4-in-1” mean?',
        a: "It means Origin does the work of four separate steps in one: a serum, a moisturiser, a sunscreen, and a primer. Designed as four, worn as one — so for most people it's the only thing they need in the morning before makeup.",
      },
      {
        q: 'What size is Origin, and how long does it last?',
        a: 'Origin comes in one size — a 50 ml pump bottle. Used properly on the face and neck every morning, it lasts about a month.',
      },
    ],
  },
  {
    label: 'Protection',
    items: [
      {
        q: 'How much sun protection does Origin give?',
        a: 'Origin is SPF 50+ and PA++++. The SPF 50+ blocks up to 98% of UVB — the rays that burn and darken skin — and PA++++, the highest rating there is, covers UVA, the rays behind ageing and pigmentation. So it protects against both.',
      },
      {
        q: 'Is the SPF real and independently tested?',
        a: 'Yes. The SPF 50+ and PA++++ are measured in an accredited lab, not estimated. The numbers on the box are the tested numbers.',
      },
      {
        q: 'What does PA++++ mean?',
        a: 'PA is the rating for how well a sunscreen blocks UVA rays — the ones that cause ageing, dark spots, and long-term damage. It runs from PA+ to PA++++. Origin is PA++++, the highest level, so it gives strong UVA protection.',
      },
      {
        q: 'Does Origin help with tanning and pigmentation?',
        a: "Yes, by preventing more of it. Tanning and dark spots come from UV exposure, and Origin's SPF 50+ / PA++++ blocks most of that, so worn every day it helps stop new tanning and pigmentation from forming. It protects — it won't lighten spots you already have.",
      },
      {
        q: 'Does Origin protect against pollution?',
        a: 'Yes. Origin is built for polluted air — its green tea (camellia sinensis) is a powerful antioxidant that helps neutralise pollution, smog, and free radicals, and the formula is shown to reduce pollution-induced skin damage by up to 40%. Made for city air, Diwali smog, and everything in between.',
      },
      {
        q: 'Do I need Origin indoors, on cloudy days, or near screens?',
        a: "Yes on cloudy days, and yes if you sit near a window. UVA rays pass through clouds and glass, so your skin is still exposed to daylight indoors. Screens give off very little UV, so they aren't a real concern — but daylight through a window is, which is why it's worth wearing every morning.",
      },
    ],
  },
  {
    label: 'Built for weather',
    items: [
      {
        q: 'Will Origin leave a white cast?',
        a: 'No — zero white cast, on any Indian skin tone. Origin has no zinc or titanium (the ingredients that usually cause a cast), so it sinks in completely clear. We tested it on deep, medium, and fair skin: no grey, no chalk, no ashiness.',
      },
      {
        q: 'Does Origin get greasy or shiny in humidity?',
        a: "No. It's a light formula that sinks in and stays comfortable and non-greasy, even on a hot, sticky day. It's made to hold up in humid weather rather than sliding off or turning oily.",
      },
      {
        q: 'Does Origin last through a full day?',
        a: "Through a normal day, yes. In our testing, worn at 8am it still looked and felt good at 2pm — no pilling, no shine, no heavy feeling. If you're outdoors in strong sun for hours, reapply during the day.",
      },
      {
        q: 'Will Origin pill or feel heavy?',
        a: "No pilling. Origin is made to layer cleanly and sit invisibly under makeup — it won't ball up or roll off, on its own or under foundation. It's very light and sinks in fast, so it never feels heavy either.",
      },
    ],
  },
  {
    label: 'Ingredients & skin',
    items: [
      {
        q: "What's in Origin? (full ingredient list)",
        a: "The sun protection comes from three UV filters (ethylhexyl methoxycinnamate, ethylhexyl salicylate, and diethylamino hydroxybenzoyl hexyl benzoate). The rest keeps skin comfortable — beta-glucan, green tea, and bisabolol are the soothing ones.\n\nFull list:\nWater, Ethylhexyl Methoxycinnamate, Propylene Glycol, Ethylhexyl Salicylate, Glycerin, C13-15 Alkane, Betaine, Camellia Sinensis Leaf Extract, Beta-Glucan, Bisabolol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Cetearyl Alcohol, Ceteareth-25, Lauric/Myristic/Palmitic/Stearic Glycerides, C14-22 Alcohols, Magnesium Aluminometasilicate, Palmitic Acid, Glyceryl Stearate, Stearic Acid, C12-20 Alkyl Glucoside, Xanthan Gum, Caprylhydroxamic Acid, Glyceryl Caprylate, Fragrance.",
      },
      {
        q: 'What are the key ingredients, and what do they do?',
        a: "A few do the real work, each sourced from where it's made best:\n\n• Beta-glucan (Finland) — strengthens the skin barrier and holds moisture; a deeper hydrator than hyaluronic acid.\n• Green tea / camellia sinensis (Japan) — a powerful antioxidant that helps defend skin against pollution and daily stress.\n• Bisabolol (from chamomile) — calms and reduces irritation.\n• Uvinul A Plus (Germany) — one of the world's most advanced UVA filters, which keeps protection stable through the day.\n\nWorld-class actives, the kind rarely seen together in Indian sun care.",
      },
      {
        q: 'Is Origin a chemical or mineral sunscreen?',
        a: "Chemical. Origin uses three chemical UV filters rather than mineral ones like zinc or titanium. Those chemical filters are what let it sink in clear with no white cast. (Chemical here just means the type of UV filter — it doesn't mean harsh.)",
      },
      {
        q: 'Is Origin fragrance-free?',
        a: 'No, it has a very light fragrance. If your skin reacts easily to fragrance, do a patch test first.',
      },
      {
        q: 'Does Origin contain any drying alcohol?',
        a: 'No. There’s no drying alcohol — the kind listed as alcohol denat. or SD alcohol. The “alcohols” in the list, cetearyl alcohol and C14-22 alcohols, are the soft, waxy kind that condition skin rather than dry it out.',
      },
      {
        q: 'Will Origin clog pores?',
        a: 'No — Origin is non-comedogenic and won’t clog pores. It’s a light, fast-absorbing milk emulsion with no heavy oils, made to wear clean every day.',
      },
      {
        q: 'Is Origin vegan and cruelty-free?',
        a: 'Yes. Origin is vegan and not tested on animals.',
      },
      {
        q: 'Is Origin good for oily or acne-prone skin?',
        a: 'Yes. It’s light, sinks in fast, and doesn’t feel greasy, which suits oily and combination skin. If you’re very acne-prone, see the note above about pore-clogging and patch test first.',
      },
      {
        q: 'Is Origin okay for sensitive skin?',
        a: 'For most people, yes. It’s made with soothing ingredients — beta-glucan and bisabolol calm the skin and help lower the chance of irritation, and green tea is an antioxidant that helps protect against daily stress. It does contain chemical UV filters and a light fragrance, which very reactive skin can occasionally react to, so if that’s you, patch test on your inner arm for two or three days before using it on your face.',
      },
      {
        q: 'Can I use Origin during pregnancy or breastfeeding?',
        a: 'It should be fine, but check with your doctor first. Origin is a chemical sunscreen, and some people prefer mineral ones during pregnancy, so it’s best to run it past your doctor before adding anything new.',
      },
      {
        q: 'Can men use Origin?',
        a: 'Yes. It’s just a daily sunscreen — it works the same on everyone, whatever your skin or gender.',
      },
    ],
  },
  {
    label: 'Wearing & delivery',
    items: [
      {
        q: 'How do I wear Origin, and where does it go in my routine?',
        a: 'You can wear Origin on its own. Because it protects, hydrates, and smooths in one step, it can be your only morning step before makeup. If you’d rather keep your usual routine, wear it last — after your other skincare, before any makeup. Either way, spread it evenly over your face and neck, let it settle for a moment, then carry on.',
      },
      {
        q: 'How much should I use?',
        a: 'About two finger-lengths for your face and neck. It sounds like a lot, but using too little is the main reason sunscreen doesn’t protect as well as it should — so don’t go thin.',
      },
      {
        q: 'Do I need to reapply, and how often?',
        a: 'For a normal day mostly indoors, your morning layer is enough. If you’re out in the sun for a few hours, reapply every two to three hours. Sweating or swimming wears it off faster, so reapply after that too.',
      },
      {
        q: 'Can I use Origin with actives like retinol, vitamin C, or AHAs?',
        a: 'Yes. Use your actives as usual — vitamin C in the morning, retinol or AHAs at night — and put Origin on last in your morning routine, once they’ve absorbed. It layers over all of them without a problem, and its soothing ingredients (beta-glucan and bisabolol) help keep skin calm even while you’re using stronger actives.',
      },
      {
        q: 'Do I still need a moisturiser under Origin?',
        a: 'For most skin, no — Origin does the job of a moisturiser too, hydrating with glycerin, betaine, and beta-glucan. If your skin is very dry, you can still wear a moisturiser first, let it sink in, then Origin on top.',
      },
      {
        q: 'Can I wear Origin under makeup?',
        a: 'Yes. Wear it as your last skincare step, give it a minute to settle, then do your makeup over it. It won’t pill under foundation, and it leaves the skin smooth so makeup goes on evenly.',
      },
      {
        q: 'Can I use Origin on my body?',
        a: 'Yes. It works on the body too — arms, neck, wherever’s exposed. Just use enough to cover the area evenly.',
      },
      {
        q: 'Can I wear Origin at night?',
        a: 'There’s no need. Sunscreen protects against daylight, so wear it in the morning. At night you can skip it.',
      },
      {
        q: 'How is Origin packaged, and why?',
        a: 'Origin comes in a glass bottle with a pump. The glass keeps the formula stable and feels better than plastic, and the pump gives a clean, measured dose each time — no dipping fingers in, no waste.',
      },
      {
        q: 'How should I store Origin, and what’s its shelf life?',
        a: 'Keep it somewhere cool, out of direct sunlight, with the pump closed. Unopened, it stays good for 18 months.',
      },
      {
        q: 'How much is Origin, and how long does delivery take?',
        a: 'Origin is ₹1,499 for a 50 ml bottle. Orders are delivered in 3 to 5 working days.',
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

export default function OriginQuestions() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null); // ✅ Default open off
  const [search, setSearch] = useState('');
  const [expandedTabs, setExpandedTabs] = useState<Record<number, boolean>>({});
  const scrollerRef = useRef<HTMLDivElement>(null);
  usePanelEdgeScroll(scrollerRef);

  const isSearching = search.trim().length > 0;

  // Search filter across all questions
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
      id="origin-questions"
      className="origin-panel relative w-screen shrink-0 h-screen flex flex-col items-center justify-center pt-16 pb-14 sm:pt-20 sm:pb-16 lg:py-0 overflow-hidden pointer-events-auto"
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
            placeholder="Search a question — white cast, actives, under makeup…"
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
                      setOpen(null); // ✅ Tab switch par bhi default closed rahega
                    }}
                    className={`pointer-events-auto shrink-0 flex items-center gap-1.5 font-suisse text-[10.5px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.14em] uppercase transition-colors whitespace-nowrap ${active
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
            {/* Active Category Items View */}
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
                      className={`grid transition-[grid-template-rows] duration-[350ms] ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
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

            {/* Search Results View */}
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
                      className={`grid transition-[grid-template-rows] duration-[350ms] ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
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

            {/* No results message */}
            {isSearching && searchResults.length === 0 && (
              <div className="text-center py-10">
                <p className="font-suisse text-xs sm:text-sm text-[var(--brand-cream)]/50">
                  No questions match &ldquo;{search}&rdquo;. Try another keyword.
                </p>
              </div>
            )}
          </div>

          {/* View All Button — placed safely inside scrollable container */}
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