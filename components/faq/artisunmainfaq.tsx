'use client';

import { useState, useMemo } from 'react';
import GlobalHeader from '@/components/GlobalHeader';

type QA = { q: string; a: string };
type Category = { id: string; label: string; items: QA[] };

const FAQ_DATA: Category[] = [
    {
        id: 'brand',
        label: 'The Brand',
        items: [
            {
                q: 'Who is behind Artisun?',
                a: 'Artisun was founded by <b>Kanika Durga</b>, who has spent the last six years as the founder of Luxe by Kan, bringing the best of global beauty to Indian customers. After years of seeing every sun care option the world had to offer, she couldn’t find one made properly for our weather and our skin — so she made it.',
            },
            {
                q: 'Why was Artisun created?',
                a: "Because sunscreen had become the step everyone dreaded — heavy, white, forgettable, and made for a lab rather than real life. We wanted to make sun care you'd actually want to wear, built for the weather Indians actually live in.",
            },
            {
                q: 'What does “Skinwear” mean?',
                a: "Skinwear is our word for the idea that sun protection should be worn with the same intent as everything else you put on. Fashion gets runways and seasons; skin, the thing facing the weather all day, got a plain tube. We're changing that — treating sun care as something you dress your skin in, not a chore you tolerate.",
            },
            {
                q: 'What does “climate-smart” mean?',
                a: 'It means we build our sunscreens around weather instead of skin type. Your skin changes with the day — oilier in heat, tighter in dry cold — so our formulas are made to hold up across those conditions, wherever you are in the country.',
            },
            {
                q: 'Is Artisun a new brand?',
                a: "Yes. We're a new Indian sun care brand, launching with two products and a clear point of view — more is on the way.",
            },
            {
                q: "What is Artisun's philosophy?",
                a: 'Sunscreen should be the easiest step of your day, not the one you skip. So we make sun care built for the weather you’re actually in, light enough to forget you’re wearing it, and good enough to leave out on your shelf instead of buried in a drawer. Worn, not tolerated — that’s the whole idea.',
            },
            {
                q: 'Is Artisun only sun care, or will there be more?',
                a: "We're focused entirely on sun care, done well, rather than trying to do everything. We're building a wardrobe of sun care over time — different forms for different needs — all made the same way.",
            },
            {
                q: 'Where can I buy Artisun?',
                a: 'You can buy Artisun directly from us at <b>artisunskin.com</b>, from <b>luxebykan.com</b> (our sister company), and on <b>Amazon</b>. We’re also coming soon to Nykaa, Tira and Myntra.',
            },
        ],
    },
    {
        id: 'basics',
        label: 'The Basics',
        items: [
            {
                q: 'What does Artisun sell?',
                a: 'Two sunscreens to start. <b>Origin</b> is a 4-in-1 milk emulsion that works as your serum, moisturiser, sunscreen and primer in one light step. <b>Aura</b> is a pearl sunscreen you dose to the weather, for a soft, dewy finish. Both are SPF 50/40, PA++++, and broad spectrum.',
            },
            {
                q: 'What makes Artisun different from other sunscreens?',
                a: "Most sunscreens sort you by skin type. We build for your weather instead, because your skin behaves differently in a humid July than a dry December. Everything we make is designed for the conditions you're actually in.",
            },
            {
                q: 'Where are the products made?',
                a: 'In India, using actives sourced from wherever in the world each one is done best — from Finland, Japan and Germany, among others.',
            },
            {
                q: 'Is Artisun vegan and cruelty-free?',
                a: 'Yes. Our products are vegan and never tested on animals, at any stage.',
            },
            {
                q: 'How much does it cost?',
                a: 'Origin is ₹1,499 and Aura is ₹1,799. You can also buy both together.',
            },
            {
                q: 'Is the packaging sustainable?',
                a: "We're mindful about our packaging and always working to do better as we grow. If you have a specific question about a component, write to us and we'll answer honestly.",
            },
        ],
    },
    {
        id: 'protection',
        label: 'Protection',
        items: [
            {
                q: 'What does SPF mean?',
                a: 'SPF stands for Sun Protection Factor. It measures how well a sunscreen protects against UVB rays — the ones that cause sunburn. SPF 30 blocks about 97% of UVB, and SPF 50 blocks about 98%.',
            },
            {
                q: 'What does PA++++ mean?',
                a: 'PA measures protection against UVA rays — the ones that cause tanning, pigmentation and premature ageing. The scale runs from PA+ to PA++++, and PA++++ is the highest level available. For Indian skin, which tans and pigments more than it burns, PA is especially important.',
            },
            {
                q: 'Is SPF or PA more important?',
                a: 'Both matter, but for Indian skin, PA deserves just as much attention as SPF. Burning is a UVB concern, while tanning and dark spots — more common on brown skin — are driven by UVA, which is what PA measures.',
            },
            {
                q: 'What does broad spectrum mean?',
                a: 'It means the sunscreen protects against both UVA and UVB rays — the full range of sun damage, not just burning. Both our products are broad spectrum.',
            },
            {
                q: 'Does a higher SPF let me use less?',
                a: 'No. A higher SPF still has to be applied in the full amount to work as labelled. Using too little is the most common mistake — it can drop your real protection well below the number on the bottle.',
            },
            {
                q: 'Does sunscreen prevent tanning and pigmentation?',
                a: 'It significantly reduces both, especially a broad-spectrum sunscreen with a high PA rating, worn properly and reapplied. Tanning and pigmentation are largely caused by UVA rays, so the PA++++ rating does the heavy lifting.',
            },
            {
                q: 'Do I need sunscreen indoors?',
                a: "Yes, if there's daylight around you. UVA rays pass through glass, so a bright room or a long drive still exposes your skin. For a mostly-indoor day, one generous morning application is usually enough.",
            },
        ],
    },
    {
        id: 'weather',
        label: 'Built for Weather',
        items: [
            {
                q: 'What does climate-smart sun care mean?',
                a: "It means we build our sunscreens around weather rather than skin type. Your skin isn't fixed — it gets oilier in heat, tighter in dry cold. Climate-smart sun care is made to hold up through those changes.",
            },
            {
                q: 'Will it work in humidity?',
                a: 'Yes. Both formulas are made for Indian humidity — light, quick to absorb, and designed not to feel greasy or slide off when it’s sticky out.',
            },
            {
                q: 'Will it work in dry or cold weather?',
                a: 'Yes. Our formulas carry hydrating actives that keep skin comfortable in dry heat and cold. With Aura, you can also use a little more on dry days.',
            },
            {
                q: 'Does it work in the monsoon?',
                a: "Yes. It holds through humid, damp weather. As with any sunscreen, reapply after you've been caught in the rain or towelled off.",
            },
            {
                q: 'Is it suitable for all Indian cities and seasons?',
                a: 'Yes — that’s the whole point of the brand. From dry northern winters to humid coastal summers, hill stations to city smog, our formulas are built to work across the country and the year.',
            },
        ],
    },
    {
        id: 'skin',
        label: 'Ingredients & Skin',
        items: [
            {
                q: 'Will it leave a white cast?',
                a: 'No. Both products are formulated to blend clear on every Indian skin tone, with no grey or ashy film.',
            },
            {
                q: 'Is it suitable for oily skin?',
                a: 'Yes. The formulas are light and fast-absorbing, and designed not to feel greasy — which suits oily skin well.',
            },
            {
                q: 'Is it suitable for dry or sensitive skin?',
                a: 'Yes. Both carry hydrating and soothing actives and are made to be gentle. They work across oily, dry, combination and sensitive skin.',
            },
            {
                q: 'Does it sit well under makeup?',
                a: 'Yes. Both are made to work as a base — they settle into the skin and makeup goes on cleanly over them, without pilling.',
            },
            {
                q: 'What are the key ingredients?',
                a: 'Origin is built with Beta-Glucan (Finland), Camellia Sinensis green tea (Japan) and Uvinul A Plus (Germany). Aura is built with Ectoin, Bisabolol and Sodium Hyaluronate. Full lists are on each product page.',
            },
            {
                q: 'Does Artisun contain fragrance?',
                a: "Origin contains a light fragrance. If you have very reactive skin or a strong preference for fragrance-free formulas, we'd suggest patch-testing first, and the full ingredient list is on the product page so you can see exactly what's inside.",
            },
            {
                q: 'Is it safe during pregnancy or breastfeeding?',
                a: "Many people use sunscreen through pregnancy, but everyone's skin and circumstances are different. We'd always recommend checking with your doctor or dermatologist before adding any product to your routine during pregnancy or breastfeeding.",
            },
            {
                q: 'Can I use it with actives like vitamin C or retinol?',
                a: "Generally yes — sunscreen is the recommended final morning step over most actives, and becomes especially important if you use retinol or acids. If you're on a prescribed routine, check with your dermatologist.",
            },
        ],
    },
    {
        id: 'buying',
        label: 'Wearing & Delivery',
        items: [
            {
                q: 'How much sunscreen should I apply?',
                a: "About two finger-lengths for your face and neck — roughly half a teaspoon. Most people use too little, which lowers protection, so it's worth being generous.",
            },
            {
                q: 'How often should I reapply?',
                a: "Every two to three hours when you're out in the sun, and after heavy sweating or swimming. On a mostly-indoor day, one generous morning application is usually enough.",
            },
            {
                q: 'How long does one bottle last?',
                a: 'With daily face-and-neck use, a bottle is designed to last around two to three months.',
            },
            {
                q: 'How should I store it?',
                a: 'Somewhere cool and out of direct sunlight. Avoid leaving it in a hot car or on a sunny windowsill.',
            },
            {
                q: 'Where do you ship, and what does it cost?',
                a: 'We ship across India, from the metros to the smallest towns. Shipping is a flat ₹80, and your first order ships free. Most orders arrive within three to five business days.',
            },
            {
                q: 'How do I track my order?',
                a: 'The moment your order ships, your tracking link comes to you on both WhatsApp and email.',
            },
            {
                q: 'Can I cancel my order?',
                a: 'Yes — within 24 hours of placing it, or any time before it ships, whichever comes first. Just message us with your order number.',
            },
            {
                q: 'What’s your returns policy?',
                a: "If your order arrives damaged, faulty or wrong, we'll replace it — raise it within 48 hours of delivery. For hygiene and safety, opened sunscreen can't be returned.",
            },
        ],
    },
];

export default function ArtisunMainFAQ() {
    const [activeTab, setActiveTab] = useState(0);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const currentCategory = FAQ_DATA[activeTab];

    const searchResults = useMemo(() => {
        if (!search.trim()) return null;
        const q = search.toLowerCase();
        const matches: { cat: string; q: string; a: string }[] = [];

        FAQ_DATA.forEach((c) => {
            c.items.forEach((item) => {
                if (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
                    matches.push({ cat: c.label, q: item.q, a: item.a });
                }
            });
        });
        return matches;
    }, [search]);

    const items = searchResults ?? currentCategory.items;

    return (
        <div className="relative w-full min-h-screen text-[var(--brand-cream)] flex flex-col items-center">
            
            
            {/* ── Exact About Page Signature Red-Orange Molten Background ── */}
            {/* ── Exact About Hero Radiant Molten Red Glow ── */}
            {/* Base Red Gradient */}
            <div
                className="fixed inset-0 pointer-events-none z-0 bg-[#8F1614]"
                style={{
                    background:
                        'linear-gradient(180deg, #78100E 0%, #9B1C18 35%, #B82A1C 65%, #D44218 100%)',
                }}
            />

            {/* Vibrant Center-Bottom Orange/Amber Glow (Exact About Stage) */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background:
                        'radial-gradient(ellipse 95% 65% at 50% 85%, #EA621E 0%, rgba(224, 76, 26, 0.85) 35%, rgba(155, 28, 24, 0) 75%)',
                }}
            />

            {/* Top Soft Radiant Light */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 50% at 50% 15%, rgba(240, 110, 45, 0.3) 0%, transparent 70%)',
                }}
            />

            <GlobalHeader />

            <div className="relative z-10 w-full max-w-[920px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-28 flex flex-col">
                {/* Header Section */}
                <span className="self-center font-suisse text-[11px] sm:text-xs tracking-[0.34em] uppercase text-[var(--brand-cream)]/75 font-semibold mb-3">
                    Everything you want to know
                </span>

                <h1 className="self-center font-editorial text-[38px] sm:text-[58px] lg:text-[72px] leading-[1.05] tracking-tight text-center font-light">
                    Questions, <em className="italic text-[var(--brand-cream)] font-normal">answered.</em>
                </h1>

                <p className="self-center font-suisse text-[14px] sm:text-[16px] text-[var(--brand-cream)]/85 mt-4 text-center max-w-[50ch] leading-relaxed">
                    The honest answers to what people ask us most — about
                    <br />
                    the brand, our sun care, and how we work. For questions on
                    <br />
                    a specific product, you'll find those on its own page.
                </p>


                {/* Category Tabs */}
                {!searchResults && (
                    <div className="mt-10 border-t border-b border-[var(--brand-cream)]/15 w-full overflow-hidden">
                        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-4 py-4 px-2">
                            {FAQ_DATA.map((c, i) => {
                                const active = i === activeTab;
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            setActiveTab(i);
                                            setOpenIndex(null);
                                        }}
                                        className={`shrink-0 inline-flex items-center justify-center font-suisse text-[11px] sm:text-[12.5px] tracking-[0.12em] uppercase transition-all px-4 py-2 rounded-full font-semibold ${active
                                            ? 'text-[var(--brand-cream)] bg-white/15 shadow-sm'
                                            : 'text-[var(--brand-cream)]/50 hover:text-[var(--brand-cream)]/85'
                                            }`}
                                    >
                                        {c.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Accordions */}
                <div className="mt-4 divide-y divide-[var(--brand-cream)]/12">
                    {searchResults && searchResults.length === 0 ? (
                        <div className="text-center py-16 font-suisse text-[var(--brand-cream)]/60 text-sm">
                            No question matches that. Try a simpler keyword.
                        </div>
                    ) : (
                        items.map((item, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div key={item.q} className="py-1">
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                                    >
                                        <span className="font-editorial text-[18px] sm:text-[22px] lg:text-[24px] text-[var(--brand-cream)] leading-snug font-normal flex-1 tracking-tight group-hover:text-white transition-colors">
                                            {item.q}
                                        </span>

                                        <span className="shrink-0 relative w-4 h-4 flex items-center justify-center">
                                            <span className="absolute w-4 h-[2px] bg-[var(--brand-cream)] rounded-sm" />
                                            <span
                                                className={`absolute w-[2px] h-4 bg-[var(--brand-cream)] rounded-sm transition-transform duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                                    }`}
                                            />
                                        </span>
                                    </button>

                                    <div
                                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div
                                                className="font-suisse text-[14.5px] sm:text-[16px] text-[var(--brand-cream)]/80 leading-[1.7] pb-6 pr-6 max-w-[68ch]"
                                                dangerouslySetInnerHTML={{ __html: item.a }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Contact Support Strip */}
                <div className="mt-14 w-full bg-white/[0.06] border border-[var(--brand-cream)]/20 rounded-[12px] p-6 sm:p-8 text-center shadow-xl">
                    <h3 className="font-editorial text-[20px] sm:text-[24px] text-[var(--brand-cream)] font-light mb-2">
                        Still wondering something?
                    </h3>
                    <p className="font-suisse text-[13.5px] sm:text-[14.5px] text-[var(--brand-cream)]/80 leading-relaxed max-w-[56ch] mx-auto">
                        Message us on Instagram at{' '}
                        <a
                            href="https://instagram.com/artisunskinwear"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--brand-cream)] font-medium underline underline-offset-4 hover:text-white"
                        >
                            @artisunskinwear
                        </a>{' '}
                        or write to{' '}
                        <a
                            href="mailto:support@artisunskin.com"
                            className="text-[var(--brand-cream)] font-medium underline underline-offset-4 hover:text-white"
                        >
                            support@artisunskin.com
                        </a>
                        . We answer within a working day.
                    </p>
                </div>
            </div>
        </div>
    );
}