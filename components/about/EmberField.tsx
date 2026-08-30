'use client';

import { useEffect, useRef } from 'react';

/**
 * Warm ember particle field — the Molten Core analog of the reference's
 * starfield. Soft glowing motes drift upward and twinkle. Canvas-based,
 * pointer-events-none, honours reduced motion, and cleans up on unmount.
 */
export default function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    type P = { x: number; y: number; r: number; vy: number; tw: number; sp: number; c: string };
    const colors = ['255,216,150', '242,166,92', '232,120,40', '255,244,220'];
    let parts: P[] = [];

    const seed = () => {
      const count = Math.min(60, Math.round((w * h) / 30000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.5,
        vy: Math.random() * 0.15 + 0.02,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.012 + 0.004,
        c: colors[(Math.random() * colors.length) | 0],
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        p.tw += p.sp;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        const a = Math.max(0, 0.25 + Math.sin(p.tw) * 0.28);
        ctx.beginPath();
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(${p.c},${a})`;
        ctx.fillStyle = `rgba(${p.c},${a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" />;
}
