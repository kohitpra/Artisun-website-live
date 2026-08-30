'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CustomCursor from '@/components/CustomCursor';
import GlobalHeader from '@/components/GlobalHeader';
import AuraHero from '@/components/aura/AuraHero';
import AuraDosage from '@/components/aura/AuraDosage';
import AuraTexture from '@/components/aura/AuraTexture';
import AuraWhere from '@/components/aura/AuraWhere';
import AuraWhatsIn from '@/components/aura/AuraWhatsIn';
import AuraProduct from '@/components/aura/AuraProduct';
import AuraQuestions from '@/components/aura/AuraQuestions';
import AuraStickyCartBar from '@/components/aura/AuraStickyCartBar';
import { asset } from '@/lib/asset';

const PANELS = 7;

export default function AuraPage() {
  const mouseProxy = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

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
    ScrollTrigger.config({ ignoreMobileResize: true });

    // The horizontal track is driven by page scroll, so ANY leftover scroll
    // offset on entry shows up as the first panel already part-way slid off to
    // the left with the second one peeking in on the right. Two things cause
    // that offset: the browser restoring a previous scroll position, and the
    // mobile address bar collapsing during load. Taking manual control of
    // restoration and pinning the page to the top before the trigger is built
    // guarantees the first panel is framed exactly to the screen on arrival.
    const prevRestoration = history.scrollRestoration;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    (window as unknown as { __ARTISUN_LENIS__?: Lenis }).__ARTISUN_LENIS__ = lenis;
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

    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (track && wrapper) {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      });

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => '+=' + getScrollAmount(),
        pin: true,
        scrub: 1,
        animation: tween,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      stRef.current = st;
    }


    // Re-assert the top position after the pin is measured — anticipatePin and
    // the initial refresh can both nudge scroll by a few px on mobile.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      if ('scrollRestoration' in history) history.scrollRestoration = prevRestoration;
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __ARTISUN_LENIS__?: Lenis }).__ARTISUN_LENIS__;
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const goToPanel = (i: number) => {
    const lenis = lenisRef.current;
    const st = stRef.current;
    if (!lenis || !st) return;
    const target = st.start + (i / (PANELS - 1)) * (st.end - st.start);
    lenis.scrollTo(target, { duration: 1.3 });
  };

  return (
    <main className="relative w-full min-h-[100svh] overflow-clip">
      <ScrollProgressBar marker={asset('/b1.webp')} markerHeight={13} />
      <div id="global-bg" className="theme-molten-core" />

      <CustomCursor mouseProxy={mouseProxy} />
      <GlobalHeader />

    <div ref={wrapperRef} className="relative w-full h-[100svh] overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-row flex-nowrap h-full will-change-transform"
        >
          <AuraHero onNavigate={goToPanel} />
          <AuraDosage />
          <AuraTexture />
          <AuraWhere />
          <AuraWhatsIn />
          <AuraProduct />
          <AuraQuestions />
        </div>
      </div>
      <AuraStickyCartBar />
    </main>
  );
}