'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import ScrollProgressBar from '../../components/ScrollProgressBar';
import CustomCursor from '../../components/CustomCursor';
import GlobalHeader from '../../components/GlobalHeader';
import Footer from '../../components/Footer';
import AboutHero from '../../components/about/AboutHero';
import ProductScrollStory, { type StoryParagraph } from '../../components/about/ProductScrollStory';
import FutureShowcase from '../../components/about/FutureShowcase';

/* ── The Artisun perspective, split across the two products ─────────────── */
const ORIGIN_PARAS: StoryParagraph[] = [
  {
    text:
      'The sunscreen you bought because you were told to. White, heavy, faintly medical.',
  },
  {
    text:
      'You wore it twice, hated how it felt, and slid it to the back of a drawer. We had that bottle too. ',

  },
  {
    text:
      'And we started wondering why the one thing we’re told to wear every day was the one thing nobody had made worth wearing.',
  },
];

const AURA_PARAS: StoryParagraph[] = [
  {
    text:
      'Sunscreens were sorted by skin type,as if your skin were a fixed thing. But your skin changes with the day.',
  },
  {
    text: 'Tight in a dry winter, greasy by ahumid afternoon, dull in the smog. The sun doesn’t check your skin type.',
  },
  {
    text:
      'It just shows up, different in every city and season. Almost nothing was built for that.',
  },
];

/* 3rd block — placeholder text, replace with real content later */
const ORIGIN_PARAS_2: StoryParagraph[] = [
  {
    text: 'We dress for the weather every day. Considered, chosen, because what we wear is seen'
  },
  { text: 'But the skin doing the real work of facing that weather got a chemist’s shelf and a note to reapply.' },
  { text: 'We thought it most certainly deserved more thought than that.' },
];

/* 4th block — placeholder text, replace with real content later */
const AURA_PARAS_2: StoryParagraph[] = [
  { text: 'Light enough to forget you have it on. Good enough to leave out instead of hidden away.' },
  { text: 'Built for your weather, not a lab’s idea of it.' },
  { text: 'Not a step to get through but something you reach for, everyday.' },
];

/* 5th block — placeholder text, replace with real content later */
const ORIGIN_PARAS_3: StoryParagraph[] = [
  { text: 'Protection you wear, the way you’d wear anything else that’s yours.' },
  { text: 'Made here, in India, for the sun we know.' },
  { text: 'Because something you put on everyday should earn its place.' },
];

export default function AboutPage() {
  const mouseProxy = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseProxy.current.px = e.clientX;
      mouseProxy.current.py = e.clientY;
      mouseProxy.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseProxy.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    gsap.set(document.documentElement, {
      '--mc-center': '100%',
      '--mc-pos-1': '20%',
      '--mc-pos-2': '50%',
      '--mc-pos-3': '110%',
      '--mc-pos-4': '200%',
      '--mc-pos-5': '250%',
      '--mc-pos-6': '300%',
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: 'bottom bottom-=500',
      end: 'bottom bottom',
      scrub: 1.5,
      animation: gsap.to(document.documentElement, {
        '--mc-center': '-10%',
        '--mc-pos-1': '0%',
        '--mc-pos-2': '20%',
        '--mc-pos-3': '40%',
        '--mc-pos-4': '60%',
        '--mc-pos-5': '80%',
        '--mc-pos-6': '100%',
        ease: 'power2.inOut',
      }),
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main className="relative w-full min-h-[100svh]">
      {/* Mood: Red Eclipse — fixed so it holds all the way down the page */}
      <div className="artisun-bg" aria-hidden />
      <ScrollProgressBar />

      <CustomCursor mouseProxy={mouseProxy} />
      <GlobalHeader />

      {/* 1 — HERO */}
      <AboutHero />

      <section className="relative z-16 w-full max-w-380 px-4 sm:px-6 md:px-16 lg:px-8 py-4 sm:py-6 md:py-10">
        <div className="w-full max-w-380 space-y-1.5 sm:space-y-2">
          <p className="font-suisse text-[var(--brand-cream)]/80 text-[15px] sm:text-[16px] md:text-[32px] lg:text-[34px] leading-[1.45] md:leading-[1.3] text-center">
            Artisun is an Indian sun-care house, built around the sun and the way we live with it.
          </p>

          <p className="font-suisse text-[var(--brand-cream)]/80 text-[15px] sm:text-[16px] md:text-[32px] lg:text-[34px] leading-[1.45] md:leading-[1.3] text-center">
            We make Skinwear&trade; — wearable layers that protect, hydrate, and move with the day.
          </p>

          {/* 3rd Line: Hidden on small/mobile screens, visible on medium+ screens */}
          <p className="font-suisse text-[var(--brand-cream)]/80 text-[15px] sm:text-[16px] md:text-[32px] lg:text-[34px] leading-[1.3] text-center hidden md:block">
            For the Indian skin, for the Indian climate and for the real Indian days.
          </p>
        </div>
      </section>

      {/* 1st — RIGHT */}
      <ProductScrollStory
        productLabel="Origin"
        productSub=""
        paragraphs={ORIGIN_PARAS}
        images={['/about-story/beginning/1.webp', '/about-story/beginning/2.webp', '/about-story/beginning/3.webp']}
        eyebrow="The Beginning"
        heading={['It started with a', 'bottle in a drawer']}
      />

      {/* 2nd — LEFT */}
      <ProductScrollStory
        productLabel="Aura"
        productSub="Pearl Skinwear"
        paragraphs={AURA_PARAS}
        images={['/about-story/problem/1.webp', '/about-story/problem/2.webp', '/about-story/problem/3.webp']}
        flip
        eyebrow="The Problem"
        heading={['It was made for a lab.', "You don't live in one."]}
      />

      {/* 3rd — RIGHT */}
      <ProductScrollStory
        productLabel="Origin"
        productSub=""
        paragraphs={ORIGIN_PARAS_2}
        images={['/about-story/feeling/1.webp', '/about-story/feeling/2.webp', '/about-story/feeling/3.webp']}
        eyebrow="The Feeling"
        heading={['Fashion gets the world.', 'Skin gets a shelf.']}
      />

      {/* 4th — LEFT */}
      <ProductScrollStory
        productLabel="Aura"
        productSub="Pearl Skinwear"
        paragraphs={AURA_PARAS_2}
        images={['/about-story/what-we-made/1.webp', '/about-story/what-we-made/2.webp', '/about-story/what-we-made/3.webp']}
        flip
        eyebrow="What We Made"
        heading={['Sun care you', 'will want to wear.']}
      />

      {/* 5th — RIGHT */}
      <ProductScrollStory
        productLabel="Origin"
        productSub=""
        paragraphs={ORIGIN_PARAS_3}
        images={['/about-story/what-we-call-it/1.webp', '/about-story/what-we-call-it/2.webp', '/about-story/what-we-call-it/3.webp']}
        eyebrow="What We Call It"
        heading={['Artisun Skinwear™']}
      />

      {/* ── Breaker Image Section ── */}
      <section className="relative z-16 w-full px-6 md:px-16 lg:px-24 py-8 md:py-12 mx-auto overflow-hidden flex flex-col items-center justify-center">
        <div className="relative w-full h-[220px] md:h-[320px] lg:h-[440px] rounded-[10px] overflow-hidden">
          <Image
            src={asset('/Artisun about us last.webp')}
            alt="Artisun sun care"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* 3 — IN YEARS TO COME */}
      <FutureShowcase />

      <Footer />
    </main>
  );
}