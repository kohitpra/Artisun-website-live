'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CustomCursor from '@/components/CustomCursor';
import GlobalHeader from '@/components/GlobalHeader';
import OriginHero from '@/components/origin/OriginHero';
import OriginWhy from '@/components/origin/OriginWhy';
import OriginWhere from '@/components/origin/OriginWhere';
import OriginWhatsIn from '@/components/origin/OriginWhatsIn';
import OriginProduct from '@/components/origin/OriginProduct';
import OriginQuestions from '@/components/origin/OriginQuestions';
import StickyCartBar from '@/components/origin/StickyCartBar';
import { asset } from '@/lib/asset';

const PANELS = 6;

export default function OriginPage() {
  const mouseProxy = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // cursor proxy
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

    // A) Lenis setup with syncTouch: false
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    // Expose for in-panel scrollers (usePanelEdgeScroll) to release gestures into.
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
      // B) Fixed scroll amount math using window.innerWidth & exact panel count
      const getScrollAmount = () => (PANELS - 1) * window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      });

      // D) Exact end matching the scroll amount
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

    document.fonts.ready.then(() => ScrollTrigger.refresh());

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
    lenis.scrollTo(target, { duration: 1.2 });
  };

  return (
    <main className="relative w-full min-h-[100svh] overflow-clip">
      <ScrollProgressBar marker={asset('/b2.webp')} markerHeight={20} />
      <div id="global-bg" className="theme-molten-core" />

      <CustomCursor mouseProxy={mouseProxy} />
      <GlobalHeader />

      <style jsx global>{`
        html, body {
          overflow-x: hidden;
        }
      `}</style>

      {/* ── 6 EXACT ORDERED PANELS ── */}
      <div ref={wrapperRef} className="relative w-full h-[100svh] overflow-hidden">
        {/* C) Fixed 600vw width on track */}
        <div
          ref={trackRef}
          className="flex flex-row flex-nowrap h-full w-[600vw] will-change-transform"
        >
          {/* 1. Home Section */}
          <OriginHero onNavigate={goToPanel} />

          {/* 2. The most boring step in your morning */}
          <OriginWhy />

          {/* 3. One sunscreen. Every Indian weather. */}
          <OriginWhere />

          {/* 4. The good vision of everything. */}
          <OriginWhatsIn />

          {/* 5. ORIGIN 4-in-1 Milk Emulsion SPF 50+ */}
          <OriginProduct />

          {/* 6. Origin questions everything answered */}
          <OriginQuestions />
        </div>
      </div>

      <StickyCartBar />
    </main>
  );
}