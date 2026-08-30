'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 → `end` over a fixed duration once `play` becomes true.
 * Every instance uses the same duration, so a group of them (all fed the same
 * `play` flag) starts and finishes together — the "all numbers count in sync"
 * effect on the Why-Origin panel.
 */
export default function CountUp({
  end,
  suffix = '',
  duration = 2,
  play,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  play: boolean;
}) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!play || started.current) return;
    started.current = true;

    if (end === 0) {
      setValue(0);
      return;
    }

    // Respect reduced-motion — snap straight to the final value.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(end);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(eased * end));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, end, duration]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}
