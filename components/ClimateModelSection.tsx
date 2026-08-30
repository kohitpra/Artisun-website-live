'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

/**
 * "The first Climate-smart sun care line"
 *
 * Two changes from the previous version:
 *
 * 1. PLAYBACK TRIGGER — the video now starts only once the section covers
 *    95–100% of the viewport, and pauses the moment it drops below that.
 *
 *    This measures viewport COVERAGE (how much of the screen the section fills),
 *    not element visibility. A ScrollTrigger `start: 'top 80%'` — or an
 *    IntersectionObserver `threshold: 0.95` — fire on how much of the ELEMENT is
 *    on screen. For a full-height section that works, but the moment the section
 *    grows past 100svh the threshold can never be reached and the video silently
 *    never plays. Coverage matches "95% to 100% fit to the screen" and holds at
 *    any section height.
 *
 *    Note `autoPlay` has also been REMOVED from the <video>. Left on, the browser
 *    starts playback at mount regardless of what this code decides, so the
 *    trigger would appear to do nothing.
 *
 * 2. LAYOUT — the copy is now one bottom-left stack (eyebrow → headline →
 *    "Built for your day & weather"), and the model sits right of centre so the
 *    text column never lands on her face or the bottles.
 */

/**
 * Model box: 85% of viewport height, left-anchored, `object-fit: contain` so the
 * whole figure stays visible — nothing cropped, nothing stretched.
 *
 * Why the width allowance changes by breakpoint:
 *
 *   2.png is 1010x1319 once trimmed — aspect 0.766. `contain` fits the image
 *   inside the box, so whichever side runs out first decides the final size.
 *
 *     desktop 1440x810   85svh = 689px, 70vw = 1008px  -> height binds, she is
 *                        exactly 85svh. The spec works as written.
 *     phone   390x844    85svh = 717px, 70vw = 273px   -> WIDTH binds, she comes
 *                        out 357px = 42svh. That is the small render you flagged.
 *
 *   To be 85svh tall at aspect 0.766 she needs 141vw of width — more than the
 *   screen has. So on phones the width cap is opened up to 100vw, which lets her
 *   reach 60svh: the tallest she can be while still fully in frame. Any taller
 *   requires cropping her, which `contain` exists to prevent.
 *
 *   If you want a true 85svh on mobile with nothing cut, the source art has to be
 *   narrower — roughly 0.38 aspect instead of 0.766. That is a re-crop of the PNG
 *   (tightening the blown hair and the outstretched arm), not something CSS can do.
 */
export default function ClimateModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Direct mobile video hardware overrides
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      if (video && video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // First user swipe/scroll/touch trigger fallback
            const handleFirstGesture = () => {
              if (video) video.play().catch(() => {});
              window.removeEventListener('touchstart', handleFirstGesture);
              window.removeEventListener('scroll', handleFirstGesture);
            };
            window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
            window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
          });
        }
      }
    };

    // Instant autoplay trigger on mount
    tryPlay();

    // Standard Intersection Observer: 15% visibility par instantly play karega
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.15 }
    );

    io.observe(section);

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="climate-model relative w-full h-[100svh] min-h-[600px] overflow-hidden select-none bg-[#0a0504] z-20"
    >
      {/* 1. Background city video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={asset('/climate-model-bg.mp4')}
          poster={asset('/climate-model-poster.webp')}
          loop
          muted
          playsInline
          autoPlay
          // `preload="auto"` pulled the whole clip down as soon as the page
          // loaded, even though this section sits several screens below the
          // fold. "metadata" fetches only the header; the poster holds the
          // frame until the browser buffers, which it does on approach.
          preload="metadata"
          aria-hidden
          className="w-full h-full object-cover opacity-90 brightness-90 pointer-events-none"
        />
      </div>

      {/* 2. Atmospheric vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,3,2,0.6) 100%), linear-gradient(to bottom, rgba(15,3,2,0.28) 0%, transparent 38%, rgba(15,3,2,0.85) 100%)',
        }}
      />

      {/* 3. Model cutout — 85svh tall, left-anchored, fully visible */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-start lg:justify-center overflow-hidden lg:overflow-visible">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/2.webp')}
          alt="Model wearing Artisun"
          className="model-cutout drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* 4. Scrims: darken only the copy column and the lower band */}
      <div
        className="lg:hidden absolute inset-x-0 top-0 h-[38%] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,4,3,0.72) 0%, rgba(12,4,3,0.30) 55%, rgba(12,4,3,0) 100%)',
        }}
      />
      <div
        className="lg:hidden absolute inset-x-0 bottom-0 h-[46%] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(12,4,3,0.9) 0%, rgba(12,4,3,0.42) 48%, rgba(12,4,3,0) 100%)',
        }}
      />

      {/* 5a. MOBILE eyebrow — top left */}
      <div className="lg:hidden absolute left-4 xs:left-5 sm:left-8 md:left-10 lg:left-14 top-20 xs:top-24 sm:top-28 lg:top-[18%] z-30 max-w-[70vw] pointer-events-none text-left">
        <p className="font-suisse text-[var(--brand-cream,#f5f0eb)] text-[14px] xs:text-[15.5px] sm:text-[19px] md:text-[22px] lg:text-[30px] font-normal leading-[1.16] tracking-[-0.015em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          So we made one
          <br />
          that&rsquo;s ready for all of it
        </p>
      </div>

      {/* 5b. MOBILE headline + subtitle — bottom right */}
      <div className="lg:hidden absolute right-4 xs:right-5 sm:right-8 md:right-10 lg:right-14 bottom-8 xs:bottom-10 sm:bottom-12 lg:bottom-14 z-30 max-w-[86vw] sm:max-w-[70vw] lg:max-w-[900px] pointer-events-none text-right">
        <h2 className="font-editorial font-[200] text-[var(--brand-cream,#f5f0eb)] text-[34px] xs:text-[39px] sm:text-[50px] md:text-[56px] lg:text-[78px] leading-[0.95] tracking-[-0.015em] lg:tracking-[-0.02em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] antialiased">
          The first
          <br />
          Climate-smart
          <span className="text-[0.25em] align-top tracking-normal font-sans ml-1">TM</span>
          <br />
          sun care line
        </h2>

        <p className="font-suisse text-[var(--brand-cream,#f5f0eb)]/85 text-[12.5px] xs:text-[14px] sm:text-[16px] md:text-[18px] lg:text-[24px] font-normal leading-[1.2] tracking-[-0.015em] mt-3 sm:mt-4 lg:mt-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          Built for your day &amp; weather,
          <br />
          not just your skin type.
        </p>
      </div>

      {/* ── DESKTOP (lg+): the ORIGINAL layout ──
          Class strings are copied VERBATIM from the original component, mobile
          prefixes included. That is deliberate and load-bearing:

            `lg:left-15` and `lg:mt-13` are NOT valid Tailwind classes — the
            default spacing scale jumps 12 → 14 → 16, and this project does not
            extend it. So Tailwind emits nothing for either, and the original
            silently fell back to `md:left-10` (40px) and `sm:mt-6` (24px).

          When I first split this block I kept only the `lg:` prefixes and
          dropped the smaller ones, which removed those fallbacks — leaving
          left:auto and margin-top:0. That is why the heading sat flush against
          the screen edge and collided with the eyebrow above it.

          Do not "tidy" the mobile prefixes out of these two elements. If you
          want real 60px / 52px values, write `lg:left-[60px]` and
          `lg:mt-[52px]`, which do generate. ── */}
      <div className="hidden lg:block absolute top-[82px] xs:top-[90px] sm:top-24 md:top-28 lg:top-[20%] xl:top-[23%] left-4 xs:left-5 sm:left-8 md:left-10 lg:left-15 z-30 w-full max-w-[92vw] sm:max-w-[85vw] lg:max-w-[900px] pointer-events-none text-left">
        <p className="font-suisse text-[var(--brand-cream,#f5f0eb)] text-[14px] xs:text-[15.5px] sm:text-[20px] md:text-[24px] lg:text-[32px] font-normal leading-[1.15] sm:leading-[1.04] tracking-[-0.015em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] translate-y-0 lg:translate-y-8">
          So we made one<br />
          that&rsquo;s ready for all of it
        </p>

        <h2 className="font-editorial font-[200] text-[var(--brand-cream,#f5f0eb)] text-[34px] xs:text-[38px] sm:text-[44px] md:text-[46px] lg:text-[84px] leading-[0.95] sm:leading-[0.94] tracking-[-0.015em] lg:tracking-[-0.02em] origin-left scale-x-100 lg:scale-x-[1.12] whitespace-normal lg:whitespace-nowrap mt-2 xs:mt-2.5 sm:mt-6 lg:mt-13 translate-y-0 lg:translate-y-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] antialiased">
          The first<br />
          Climate-smart<span className="text-[0.25em] align-top tracking-normal font-sans ml-1">TM</span><br />
          sun care line
        </h2>
      </div>

      <div className="hidden lg:block absolute bottom-8 xs:bottom-10 sm:bottom-12 md:bottom-14 lg:bottom-10 xl:bottom-14 right-4 xs:right-5 sm:right-8 md:right-10 lg:right-16 z-30 w-auto max-w-[220px] xs:max-w-[250px] sm:max-w-[360px] lg:max-w-[650px] text-right pointer-events-none">
        <p className="font-suisse text-[var(--brand-cream,#f5f0eb)] text-[12px] xs:text-[13.5px] sm:text-[16px] md:text-[18px] lg:text-[26px] font-normal leading-[1.18] lg:leading-[1.04] tracking-[-0.015em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
          Built for your day &amp; weather,<br />
          not just your skin type.
        </p>
      </div>

      <style jsx>{`
        /* Sizing comes from the live-tunable variables in app/globals.css —
           see the MOBILE IMAGE ALIGNMENT block there. */
        .model-cutout {
          height: var(--climate-model-h, 85svh);
          width: var(--climate-model-w, 100vw);
          max-width: none;
          object-fit: contain;
          object-position: var(--climate-model-pos, left bottom);
          transform: translate(-32%, 0%);
        }
        /* Desktop: the ORIGINAL geometry — 94vh tall, centred, capped at 95vw.
           None of the mobile variables apply here. */
        @media (min-width: 1024px) {
          .model-cutout {
            height: 94vh;
            width: auto;
            max-width: 95vw;
            object-fit: contain;
            object-position: center bottom;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
