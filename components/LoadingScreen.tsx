'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { asset } from '@/lib/asset';

/**
 * LoadingScreen
 * -------------
 * The Artisun monogram sits on the Red Eclipse background and fills with the
 * brand beige as the home page's images and videos arrive.
 *
 * How the fill works: the mark is drawn twice, stacked. The bottom copy is a
 * faint translucent beige — that is the "empty" state you see at 0%. The top
 * copy is solid beige and is revealed by a clip that rises from the floor of
 * the mark in step with real load progress, so the logo visibly fills up. At
 * 100% the clip has cleared the top and the mark is wholly beige.
 *
 * The artwork is pulled from /logo-artisun.svg as a mask rather than inlined,
 * so the logo lives in exactly one place.
 */
export default function LoadingScreen({
  onComplete,
  progress = 0,
}: {
  onComplete: () => void;
  progress?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const shownRef = useRef(0);

  /* ── Drive the fill + the counter from real progress ── */
  useEffect(() => {
    if (fillRef.current) {
      // `inset(N% 0 0 0)` clips from the top down: 100% hides the solid mark
      // completely, 0% reveals all of it. Tweened rather than set, because a
      // preloader reports progress in chunks (one asset at a time) and the
      // tween turns those steps into a continuous rise.
      gsap.to(fillRef.current, {
        clipPath: `inset(${100 - progress}% 0% 0% 0%)`,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    const counter = { val: shownRef.current };
    gsap.to(counter, {
      val: progress,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        shownRef.current = counter.val;
        setDisplayProgress(counter.val);
      },
    });
  }, [progress]);

  /* ── Hand over to the page once everything is in ── */
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (progress < 100) return;

    const tl = gsap.timeline();

    // Settle on a full, clean beige before anything moves.
    tl.to(fillRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.6,
      ease: 'power2.out',
    });

    tl.to(captionRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3');

    // Lift the whole screen away to reveal the hero.
    tl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 1.1,
        ease: 'expo.inOut',
        onComplete: () => {
          onCompleteRef.current();
          if (containerRef.current) containerRef.current.style.display = 'none';
        },
      },
      '+=0.25'
    );

    return () => {
      tl.kill();
    };
  }, [progress]);

  const logo = asset('/logo-artisun.svg');
  // Both layers are the same artwork; only colour and clip differ, so they are
  // painted as masked colour blocks rather than tinted <img> elements.
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${logo})`,
    maskImage: `url(${logo})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden will-change-transform"
      style={{ background: 'var(--bg-eclipse)' }}
    >
      {/* Film grain, matched to the rest of the site */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Warm centre bloom so the mark sits in light, not on flat colour */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(255,150,70,0.16) 0%, transparent 62%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* ── The monogram ── */}
        <div className="relative w-[58vw] max-w-[260px] sm:max-w-[320px] md:max-w-[380px] aspect-[964/800]">
          {/* Empty state — translucent beige */}
          <div
            className="absolute inset-0"
            style={{ ...maskStyle, backgroundColor: 'var(--brand-cream, #E8DCC8)', opacity: 0.18 }}
          />

          {/* Filled state — solid beige, revealed bottom-up by load progress */}
          <div
            ref={fillRef}
            className="absolute inset-0"
            style={{
              ...maskStyle,
              backgroundColor: 'var(--brand-cream, #E8DCC8)',
              clipPath: 'inset(100% 0% 0% 0%)',
              willChange: 'clip-path',
            }}
          />
        </div>

        {/* ── Caption + counter ── */}
        <div
          ref={captionRef}
          className="mt-7 sm:mt-9 w-full flex flex-col items-center text-center font-suisse uppercase select-none"
          style={{ opacity: 0.9 }}
        >
          <span className="text-[12px] sm:text-[14px] font-medium tracking-[0.16em] text-[var(--brand-cream)]/70 whitespace-nowrap">
            A New Language of Suncare
          </span>
          <span className="font-editorial text-[var(--brand-cream)] text-2xl sm:text-3xl md:text-4xl tracking-normal leading-none mt-2 tabular-nums">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
