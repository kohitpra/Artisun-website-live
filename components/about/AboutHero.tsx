'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { asset } from '@/lib/asset';

// Loaded on demand and client-only. `ssr: false` matters as much as the split:
// a WebGL canvas cannot render on the server anyway, so prerendering it just
// pulls three.js into the server bundle for nothing.
const AboutHeroScene = dynamic(() => import('./AboutHeroScene'), {
  ssr: false,
  loading: () => null,
});

const HERO_SUB =
  'Artisun is an Indian sun-care house, built around the sun and the way we live with it. We make Skinwear — wearable layers that protect, hydrate, and move with the day.';

export default function AboutHero() {
  const scrollRef = useRef(0);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / Math.max(1, window.innerHeight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPortrait = h > w;

      if (w < 480) {
        // Mobile screens
        setScale(0.18);
      } else if (w < 820) {
        // Tablets like iPad Mini / iPad portrait
        setScale(isPortrait ? 0.21 : 0.26);
      } else if (w <= 1024) {
        // iPad Pro / small laptops
        setScale(isPortrait ? 0.24 : 0.32);
      } else if (w < 1440) {
        // Standard laptops & desktops
        setScale(0.36);
      } else {
        // Ultra-wide screens
        setScale(0.42);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <section className="relative w-full h-[65svh] sm:h-[75svh] md:h-screen lg:h-screen overflow-hidden flex items-center justify-center">
      {/* Soft dark stage glow so the wordmark + bottle read against the molten bg */}

      {/* Giant ARTISUN wordmark — Force wide stretch across all screens */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-[2] flex items-center justify-center px-3 sm:px-6 md:px-8 w-full">
        <div className="relative w-full max-w-[96vw] lg:max-w-[1650px] flex items-center justify-center">
          <Image
            src={asset('/logo.png')}
            alt="ARTISUN"
            width={2000}
            height={445}
            priority
            className="w-full h-auto object-contain select-none scale-105 sm:scale-100"
            style={{
              filter: 'brightness(0) invert(1)',
              opacity: 0.9,
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      </div>

      {/* Revolving 3D product */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <AboutHeroScene scrollRef={scrollRef} scale={scale} />
      </div>

      {/* Top-left kicker (GAZU's "fashion that moves with you") */}
      <div className="absolute left-6 top-28 md:left-12 md:top-32 z-[5] pointer-events-none">
        <p className="font-suisse uppercase tracking-[0.32em] text-[10px] md:text-[12px] text-[var(--brand-cream)]/70 leading-[1.9]">
          <br />

        </p>
      </div>



      {/* Scroll cue — bottom-right (GAZU's "new collection 2024") */}
      <div className="hidden md:block absolute right-6 bottom-14 md:right-12 md:bottom-16 z-[5] pointer-events-none text-right">
        <p className="font-suisse uppercase tracking-[0.28em] text-[10px] md:text-[11px] text-[var(--brand-cream)]/55">

          <br />

        </p>
      </div>
    </section>
  );
}

