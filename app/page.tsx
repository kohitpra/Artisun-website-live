'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { preloadAll } from '../lib/preloader';
import ScrollProgressBar from '../components/ScrollProgressBar';
import LoadingScreen from '../components/LoadingScreen';
import HeroSection from '../components/HeroSection';
import CustomCursor from '../components/CustomCursor';
import TextRevealSection from '../components/TextRevealSection';
import WornSection from '../components/WornSection';
import HomeHeader from '../components/HomeHeader';
import ClimateVideoSection from '../components/climate/ClimateVideoSection';
import ClimateModelSection from '../components/ClimateModelSection';
import ProductShowcaseSection from '../components/ProductShowcaseSection';
import FashionSkinSection from '@/components/FashionSkinSection';
import Footer from '../components/Footer';

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  // Mouse Proxy for performance (no react state re-renders on mousemove)
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

  // Real loading progress
  useEffect(() => {
    preloadAll((progress) => setMediaProgress(progress)).catch(console.error);
  }, []);

  // ── Smooth scroll (Lenis) driven by GSAP's single ticker ──
  // The library + CSS were already in place but no instance was ever created, so
  // scrolling ran on the raw native event loop while heavy GSAP scrub animations and
  // canvas render loops competed for the main thread — the source of the jank.
  // Driving Lenis from gsap.ticker means one rAF loop powers smoothing AND ScrollTrigger.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Entrance animations for Hero elements once loading is done
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Mobile browsers resize the viewport (innerHeight) as the address bar
    // collapses/expands *during* scroll. ScrollTrigger auto-refreshes on resize by
    // default, which recalculates every viewport-relative pin length (e.g. "+=200%")
    // against the new height — visibly shifting total page height and scroll position
    // mid-scroll. This flag is GSAP's built-in fix for exactly that class of jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (loadingComplete) {
      // Refresh ScrollTrigger to recalculate heights after loading screen goes away
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.getAll().forEach(st => st.refresh());
        });
      });

      // Custom fonts (font-editorial) can swap in after the refresh above,
      // reflowing section heights and leaving every pin's cached start/end
      // position stale — which shows up as a jump right as a section pins.
      // Re-refresh once fonts have actually settled to fix that up.
      document.fonts.ready.then(() => {
        ScrollTrigger.getAll().forEach(st => st.refresh());
      });

      // Hero entrance + the wordmark→header morph are handled inside HeroSection
      // and HomeHeader (gated on the `ready` flag). Here we only drive the global
      // molten background and refresh triggers once the loading screen lifts.

      // Origin gradient applied globally without scroll distortion

    }
  }, [loadingComplete]);

  return (
    <main ref={mainRef} className="relative w-full min-h-[100svh] overflow-clip">
      <ScrollProgressBar />

      {/* Global Origin Red-Orange Background */}
      <div
        id="global-bg"
        className="fixed inset-0 w-full h-full pointer-events-none -z-50"
        style={{
          background:
            'var(--bg-eclipse)',
        }}
      />

      {!loadingComplete && (
        <LoadingScreen progress={mediaProgress} onComplete={() => setLoadingComplete(true)} />
      )}

      <CustomCursor mouseProxy={mouseProxy} />

      <HomeHeader ready={loadingComplete} />
      <HeroSection ready={loadingComplete} />
      <WornSection />
      <TextRevealSection />
      <ClimateVideoSection />
      <ClimateModelSection />
      <ProductShowcaseSection />
      <FashionSkinSection />
      <Footer />
    </main>
  );
}
