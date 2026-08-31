'use client';

import { useEffect, useRef } from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import CustomCursor from '@/components/CustomCursor';
import ContactContent from '@/components/contact/contactcontent';

export default function ContactPage() {
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
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <CustomCursor mouseProxy={mouseProxy} />
      <GlobalHeader />
      <ContactContent />
    </main>
  );
}