'use client';

import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ProductCard = {
  href: string;
  img: string;
  name: string;
  sub: string;
  spec: string;
};

const CARDS: ProductCard[] = [
  {
    href: '/origin',
    img: asset('/about-media/origin-hero.webp'),
    name: 'Origin',
    sub: '4-in-1 Milk Emulsion',
    spec: 'SPF 50+ · PA++++',
  },
  {
    href: '/aura',
    img: asset('/about-media/aura-1.webp'),
    name: 'Aura',
    sub: 'Pearl Skinwear™',
    spec: 'SPF 40 · PA+++',
  },
];

function GlassCard({ card }: { card: ProductCard }) {
  return (
    <Link
      href={card.href}
      aria-label={`${card.name} — ${card.sub}`}
      className="group flex items-center gap-2.5 sm:gap-3.5 w-[48%] sm:w-[235px] md:w-[260px] lg:w-[280px] xl:w-[298px] p-2 sm:p-3 rounded-[16px] sm:rounded-[20px] bg-black/60 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-white/20 transition-all duration-300 hover:border-white/50 hover:bg-white/[0.08]"
    >
      {/* Square Image Box */}
      <span className="relative block h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[68px] lg:w-[68px] shrink-0 overflow-hidden rounded-[10px] xs:rounded-[12px] sm:rounded-[14px] ring-1 ring-white/30 bg-black/30">
        <Image
          src={card.img}
          alt={card.name}
          fill
          sizes="70px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>

      {/* Info Layout */}
      <span className="flex-1 min-w-0 pr-0.5">
        <span className="block font-editorial text-white text-[15px] xs:text-[17px] sm:text-[18.5px] md:text-[20px] leading-tight font-normal">
          {card.name}
        </span>
        <span className="mt-0.5 sm:mt-1 block font-suisse text-[11px] xs:text-[12px] sm:text-[13.5px] md:text-[14.5px] text-white/95 truncate font-normal">
          {card.sub}
        </span>
        <span className="mt-0.5 block font-suisse text-[9px] xs:text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.06em] uppercase text-white/80 font-medium">
          {card.spec}
        </span>
      </span>

      {/* Right Arrow */}
      <span className="shrink-0 text-white opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100 hidden xs:block">
        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

export default function WornSection() {
  return (
    <section
      className="relative w-full min-h-[100svh] h-[100svh] z-20 flex flex-col justify-between overflow-hidden px-4 xs:px-5 sm:px-8 md:px-12 lg:px-14 xl:px-20 pt-16 xs:pt-18 sm:pt-24 lg:pt-0 pb-4 xs:pb-5 sm:pb-6 lg:pb-0"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {/* ── 1. MODEL IMAGE: 100% Screen-Proof for Mac, Laptop & Mobile ── */}
      <div className="absolute inset-x-0 lg:inset-x-auto lg:left-0 bottom-0 z-10 w-full lg:w-1/2 xl:w-[54%] h-full pointer-events-none flex items-end justify-center lg:justify-start overflow-visible">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/Without bg.webp')}
          alt="Artisun Model"
          className="h-[58vh] xs:h-[62vh] sm:h-[75vh] md:h-[82vh] lg:h-[95vh] xl:h-[100vh] w-auto max-w-none object-contain object-bottom lg:object-left-bottom select-none -translate-x-[4%] sm:-translate-x-[8%] lg:-translate-x-[6%] xl:-translate-x-[3%] translate-y-1 sm:translate-y-0 lg:translate-y-2 drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* ── 2. TEXT BLOCK: High Clear Ceiling on Mobile + Safe Right Column on Mac/Laptop ── */}
      <div
        className="relative z-20 w-full lg:w-1/2 xl:w-[48%] max-w-full ml-auto flex flex-col items-start text-left lg:items-end lg:text-right pt-0 sm:pt-4 lg:pt-0 lg:my-auto lg:-translate-y-6"
      >
        {/* Main Headline */}
        <h2 className="font-editorial text-[var(--brand-cream,#f5f0eb)] text-[34px] xs:text-[38px] sm:text-[44px] md:text-[48px] lg:text-[34px] xl:text-[44px] 2xl:text-[52px] leading-[1.02] lg:leading-[1.08] tracking-[-0.02em] font-normal drop-shadow-md w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[560px] lg:max-w-[500px] xl:max-w-[620px] 2xl:max-w-none">
          {/* Mobile Exact 3 Lines */}
          <span className="block lg:hidden">
            Most sunscreens are made<br />
            to be tolerated, ours is<br />
            designed to be worn.
          </span>

          {/* Desktop & Mac */}
          <span className="hidden lg:block">
            Most sunscreens are made to be tolerated, ours is designed to be worn.
          </span>
        </h2>

        {/* Sub-Description */}
        <p className="font-suisse text-[var(--brand-cream,#f5f0eb)]/90 text-[14px] xs:text-[15.5px] sm:text-[17px] lg:text-[16px] xl:text-[19px] 2xl:text-[21px] leading-[1.32] sm:leading-[1.45] font-normal mt-2 xs:mt-3 sm:mt-5 lg:mt-6 w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[480px] lg:max-w-[420px] xl:max-w-[480px] drop-shadow-sm">
          Because you’ll only wear it every day if it survives every kind of day.
        </p>
      </div>

      {/* ── 3. PRODUCT CARDS: Bottom Anchored on Mobile, Bottom-Right on Desktop ── */}
      <div className="relative lg:absolute z-30 w-full lg:w-auto max-w-[440px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-none mx-auto lg:mx-0 mt-auto lg:mt-0 right-auto lg:right-10 xl:right-20 bottom-0 lg:bottom-8 xl:bottom-10 flex flex-row justify-between sm:justify-center items-center gap-2 sm:gap-3.5 lg:gap-4 px-0">
        {CARDS.map((card) => (
          <GlassCard key={card.href} card={card} />
        ))}
      </div>
    </section>
  );
}