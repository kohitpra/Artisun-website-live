'use client';

import { useEffect, useRef } from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import Collection from '@/components/collection/Collection';
import MobileScrollFrame from '@/components/MobileScrollFrame';

export default function CollectionPage() {
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

  return (
    <main className="relative w-full min-h-screen overflow-x-clip selection:bg-[#A52A2C] selection:text-[#F3ECE0]">
      {/* Red Eclipse background — kept OUTSIDE the mobile scroll frame:
          iOS treats position:fixed elements inside a touch scroll container
          as absolute, so inside the frame it would scroll away. */}
      <div className="artisun-bg" aria-hidden />
      <CustomCursor mouseProxy={mouseProxy} />
      <GlobalHeader />
      {/* iOS 26 chrome fix: mobile content scrolls inside this fixed frame
          so nothing slides behind Safari's translucent status bar / bottom
          controls (same mechanic as the Origin page). Desktop unaffected. */}
      <MobileScrollFrame>
        <Collection
          h1Title="Your skin type didn't change this morning. The weather did."
          subtitle="So we launched two layers. One wears dewy. One wears invisible. Both are built for Indian weather."
        />
        <Footer />
      </MobileScrollFrame>
    </main>
  );
}