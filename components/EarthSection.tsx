'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const earthTitle = "A Climate-smart approach to Suncare";
const earthSubtitle = "bringing protection that moves with climate, not just skin type.";
const FRAME_COUNT = 240;

const currentFrame = (index: number) => asset(`/earth-frames/frame_${String(index).padStart(4, '0')}.jpg`);

export default function EarthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const earthTitleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const earthSubWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  earthTitleWordsRef.current = [];
  earthSubWordsRef.current = [];

  // Preload images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  useEffect(() => {
    // Preload all frames for smooth scrolling and decode them asynchronously
    // to prevent the main thread from blocking (stuttering) during the first draw.
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.decode().catch(() => {}); // Non-blocking decode
      imagesRef.current.push(img);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !section) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = canvas.getContext('2d');
    if (!context) return;

    // The state object GSAP will animate
    // Declared before resizeCanvas (which reads it) so the initial resizeCanvas()
    // call below doesn't hit a temporal-dead-zone ReferenceError.
    const animationState = {
      frame: 0
    };

    // Entry-transition state, animated by the entry timeline below.
    // warmth 1→0: how strongly the molten-core palette is graded onto the canvas.
    // feather 55→16: how deep the top edge of the canvas is feathered (in %).
    const entryState = {
      warmth: 1,
      feather: 55,
    };

    // Set canvas dimensions with Retina (High-DPI) support for a premium crisp look
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Max DPR of 2 for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderFrame(animationState.frame);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Draw the image with object-fit: cover logic
    function renderFrame(index: number) {
      if (!context || !canvas) return;
      let img = imagesRef.current[index];
      
      // Fallback: If scrolling really fast and the exact frame isn't loaded yet,
      // search backwards for the nearest loaded frame to prevent visual stutter/freezing.
      if (!img || !img.complete) {
        let found = false;
        for (let i = index - 1; i >= 0; i--) {
          if (imagesRef.current[i]?.complete) {
            img = imagesRef.current[i];
            found = true;
            break;
          }
        }
        if (!found) return; // Give up if no frames are loaded at all yet
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image (e.g. ultrawide screen)
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Canvas is taller than image (e.g. mobile portrait)
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // ── Molten color grade, baked into the image itself ──
      // While the section is entering, the exact molten-core palette (#E8601A →
      // #B52010 → #7A0808) is graded onto the frame, strongest at the top and
      // decaying to nothing past the horizon. As entryState.warmth scrubs 1→0 the
      // scene cools from "sunset sky" to its natural cosmic tones — the gradient
      // of the previous section literally becomes the Earth, rather than a flat
      // overlay sitting on top of it.
      const warm = entryState.warmth;
      if (warm > 0.005) {
        const grade = context.createLinearGradient(0, 0, 0, canvas.height);
        grade.addColorStop(0, `rgba(232, 96, 26, ${0.55 * warm})`);
        grade.addColorStop(0.32, `rgba(181, 32, 16, ${0.32 * warm})`);
        grade.addColorStop(0.62, `rgba(122, 8, 8, ${0.14 * warm})`);
        grade.addColorStop(1, 'rgba(24, 1, 2, 0)');
        context.fillStyle = grade;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Ensure the first frame renders once it loads
    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = () => renderFrame(0);
    }

    // ── ENTRY: Evolution's molten gradient becomes the cosmic Earth ──
    // The previous section (Evolution) closes on the warm molten-core background —
    // the same fixed #global-bg that shows through this canvas while it's transparent.
    // Three things are choreographed together against the section's approach:
    //
    //   1. The canvas fades up early (ease-out: entering elements should respond
    //      immediately) so most of the scroll is spent on the *grade*, not the fade.
    //   2. entryState.warmth scrubs 1→0, cooling the molten color grade that
    //      renderFrame bakes into the image — the sky itself changes gradient.
    //   3. The top feather starts deep (55%: the Earth surfaces through the warm sky
    //      like a mirage) and tightens to 16% as the scene resolves, while the planet
    //      settles from a slight rise/scale on a strong ease-out.
    //
    // No overlays — the blend lives in the image and the mask. Scrubbed with a 1s
    // smoothing so it flows with Lenis rather than stepping.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(maskRef.current, {
      autoAlpha: 0,
      yPercent: reduceMotion ? 0 : 6,
      scale: reduceMotion ? 1 : 1.06,
      transformOrigin: '50% 60%',
    });

    const applyFeather = () => {
      const el = maskRef.current;
      if (!el) return;
      const m = `linear-gradient(to bottom, transparent 0%, black ${entryState.feather}%, black 100%)`;
      el.style.setProperty('-webkit-mask-image', m);
      el.style.setProperty('mask-image', m);
    };
    applyFeather();

    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      },
    });

    entryTl
      .to(maskRef.current, { autoAlpha: 1, ease: 'power1.out', duration: 0.6 }, 0)
      .to(maskRef.current, { yPercent: 0, scale: 1, ease: 'power3.out', duration: 1 }, 0)
      .to(entryState, {
        warmth: 0,
        feather: 16,
        ease: 'power1.inOut',
        duration: 1,
        onUpdate: () => {
          applyFeather();
          renderFrame(animationState.frame);
        },
      }, 0);

    // ── PIN: Hold EarthSection while the title/subtitle reveal plays ──
    const earthPin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=250%',
      pin: true,
      anticipatePin: 1,
    });

    // Tie the video frame to the scroll progress
    const videoScrub = gsap.to(animationState, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=250%',
        scrub: true, // Immediate 1:1 scrub removes the "lagging" feeling
      },
      onUpdate: () => renderFrame(animationState.frame),
    });

    // Text Reveal Animations
    const titleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      animation: gsap.to(earthTitleWordsRef.current, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
      }),
    });
    
    // Subtitle words highlight one by one across the bulk of the pinned rotation —
    // the reveal tracks the Earth's spin instead of flashing done in the first few
    // percent, so the text and the frames read as one scroll-driven motion. It
    // completes at 200% of the 250% pin, leaving a beat of fully-lit text before unpin.
    const subtitleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=200%',
      scrub: true,
      animation: gsap.to(earthSubWordsRef.current, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
      }),
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      earthPin?.kill();
      videoScrub?.kill();
      titleTrigger?.kill();
      subtitleTrigger?.kill();
      entryTl.scrollTrigger?.kill();
      entryTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100svh] z-[9] bg-transparent -mt-[50svh]"
    >
      {/*
        Top Feather Mask:
        Feathers only the TOP edge so the dark space melts into the warm sky above —
        no rectangular seam. The feather depth is animated by the entry timeline
        (deep 55% while surfacing through the molten sky, tightening to 16% as the
        scene resolves); this static value matches the settled state. The bottom is
        left solid (no exit blend). Opacity/rise/scale are driven by the same timeline.
      */}
      <div
        ref={maskRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 100%)',
          willChange: 'transform, opacity',
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Text block */}
      <div className="absolute bottom-[10%] left-0 w-full px-4 md:px-6 z-20 flex flex-col items-center text-center pointer-events-none">
        <div className="w-full max-w-[95vw] xl:max-w-[1400px] flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em] font-editorial font-normal text-[26px] md:text-[38px] lg:text-[50px] leading-[1.2] tracking-tight text-white">
          {earthTitle.split(" ").map((word, i) => (
            <span
              key={`et-${i}`}
              ref={el => { if (el) earthTitleWordsRef.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>
        <div className="w-full max-w-[95vw] xl:max-w-[1400px] mt-1 md:mt-2 flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.15em] font-editorial font-normal text-[26px] md:text-[38px] lg:text-[50px] leading-[1.2] tracking-tight text-white/70">
          {earthSubtitle.split(" ").map((word, i) => (
            <span
              key={`es-${i}`}
              ref={el => { if (el) earthSubWordsRef.current.push(el); }}
              className="opacity-[0.15]"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
