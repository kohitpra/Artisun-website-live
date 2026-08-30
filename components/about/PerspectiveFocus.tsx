'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Premium "reader" for the Artisun perspective: a warm paper sheet sits pinned
 * on a dark spotlight while the lines glide through it. The line nearest the
 * sheet's centre is dark and crisp; lines above/below fade toward the paper and
 * are feathered at the edges — a tight ~3-line focus. A slim bar under the
 * sheet tracks reading progress. Driven off GSAP's ticker (shared with Lenis).
 */
const paragraphs: { lines: { t: string; e?: boolean }[] }[] = [
  {
    lines: [
      { t: 'Artisun was born out of refusal.' },
      { t: 'After years of experiencing disconnect with every sunscreen it tried, it refused.' },
    ],
  },
  {
    lines: [
      { t: 'It refused to let sun care sit as an afterthought in a long lineup of beauty products.' },
      { t: 'It refused to treat sunscreen as an occasional use when it should have been the foundation of every morning.' },
      { t: 'It refused formulas built around skin type alone, with no consideration for the climate the skin lives in.' },
    ],
  },
  {
    lines: [
      { t: 'So Artisun came forward.' },
      { t: 'Not to add another sunscreen to a crowded shelf,' },
      { t: 'But to do something the category had never quite done —' },
      { t: 'Take Indian sun protection seriously.', e: true },
    ],
  },
  {
    lines: [
      { t: 'To formulate for the humidity of Mumbai’s monsoon.' },
      { t: 'To stand up to the heat of Chennai’s afternoon.' },
      { t: 'To hold its ground through the pollution of Delhi’s evening.' },
    ],
  },
  {
    lines: [
      { t: 'Because the Indian sun is anything but forgiving' },
      { t: 'And what pays the price is skin that breathes unprotected—' },
      { t: 'Pigmentation that darkens slowly,' },
      { t: 'Fine lines that arrive earlier than they should,' },
      { t: 'Skin tone that loses evenness across the year,' },
      { t: 'Damage that doesn\'t show today, but compounds over time' },
    ],
  },
  {
    lines: [
      { t: 'Artisun brings to you sun care,' },
      { t: 'Made the way it should always have been made,' },
      { t: 'For the Indian skin.' },
      { t: 'For the Indian climate.' },
      { t: 'For the REAL Indian days.', e: true },
    ],
  },
];

const PAPER = '#E6D5C1';

export default function PerspectiveFocus() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const track = trackRef.current;
    const els = items.current.filter(Boolean) as HTMLElement[];
    if (!wrap || !card || !track) return;

    // Reduced motion → static paper letter, everything legible.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.height = 'auto';
      card.style.overflow = 'visible';
      track.style.padding = '3rem 0';
      els.forEach((e) => {
        e.style.opacity = '1';
        e.querySelectorAll('.word').forEach((w) => {
          (w as HTMLElement).style.opacity = '1';
        });
      });
      return;
    }

    const update = () => {
      const win = window.innerHeight;
      const wr = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - win;
      const p = total > 0 ? Math.min(1, Math.max(0, -wr.top / total)) : 0;

      const cardH = card.clientHeight;
      const N = els.length;
      if (N === 0) return;

      const targetYs = els.map((el) => el.offsetTop + el.offsetHeight / 2 - cardH / 2);

      const totalUnits = 4 * N - 1;
      const u = p * totalUnits;

      let currentTrackY = targetYs[0];
      const wordProgress: number[] = new Array(N).fill(0);

      let currentUnit = 0;
      for (let i = 0; i < N; i++) {
        const pauseStart = currentUnit;
        const pauseEnd = currentUnit + 3;

        if (u >= pauseStart && u <= pauseEnd) {
          currentTrackY = targetYs[i];
          wordProgress[i] = (u - pauseStart) / 3;
        } else if (u > pauseEnd) {
          wordProgress[i] = 1;
        }

        currentUnit += 3;

        if (i < N - 1) {
          const transStart = currentUnit;
          const transEnd = currentUnit + 1;
          if (u >= transStart && u <= transEnd) {
            const localP = (u - transStart) / 1;
            // Smooth easeInOut cubic
            const easeP = localP < 0.5 ? 4 * localP * localP * localP : 1 - Math.pow(-2 * localP + 2, 3) / 2;
            currentTrackY = targetYs[i] + (targetYs[i + 1] - targetYs[i]) * easeP;
          }
          currentUnit += 1;
        }
      }

      if (u <= 0) currentTrackY = targetYs[0];
      if (u >= totalUnits) currentTrackY = targetYs[N - 1];

      track.style.transform = `translate3d(0, ${-currentTrackY.toFixed(1)}px, 0)`;
      if (fillRef.current) fillRef.current.style.width = `${(p * 100).toFixed(2)}%`;

      const cr = card.getBoundingClientRect();
      const mid = cr.top + cr.height / 2;
      const bright = cardH * 0.15;
      const fade = cardH * 0.15;

      for (let i = 0; i < N; i++) {
        const el = els[i];
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        const op = dist <= bright ? 1 : Math.max(0, 1 - (dist - bright) / fade);
        const blur = dist <= bright ? 0 : Math.min(5, ((dist - bright) / cardH) * 24);
        const sc = 0.93 + op * 0.07;

        el.style.opacity = op.toFixed(3);
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
        el.style.transform = `scale(${sc.toFixed(3)})`;

        // Handle words
        const words = el.querySelectorAll('.word');
        const numWords = words.length;
        const hlCount = Math.floor(wordProgress[i] * numWords);

        words.forEach((w, idx) => {
          (w as HTMLElement).style.opacity = idx < hlCount ? '1' : '0.2';
        });
      }
    };

    gsap.ticker.add(update);
    update();
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: `600vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* centered paper reader */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16">
          <div className="relative w-full max-w-[650px]">
            <div
              ref={cardRef}
              className="about-paper relative w-full h-[75vh] md:h-[80vh] overflow-hidden rounded-[16px] border border-[rgba(42,19,10,0.12)] origin-center"
              style={{
                background: PAPER,
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 60px -20px rgba(0,0,0,0.55), 0 60px 120px -34px rgba(0,0,0,0.5)',
              }}
            >
              <div ref={trackRef} className="relative py-[38vh] md:py-[40vh] will-change-transform flex flex-col gap-12 md:gap-16">
                {paragraphs.map((p, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      items.current[i] = el;
                    }}
                    style={{ opacity: 0.1 }}
                    className="flex flex-col items-center justify-center text-center px-6 md:px-12 will-change-[opacity,transform]"
                  >
                    {p.lines.map((l, j) => {
                      const words = l.t.split(' ');
                      return (
                        <p
                          key={j}
                          className={`font-editorial tracking-wide leading-[1.45] text-[15px] sm:text-[16px] md:text-[25px] ${l.e ? 'italic text-[#C02D19]' : 'text-[#3D332D]'
                            }`}
                        >
                          {words.map((w, k) => (
                            <span
                              key={k}
                              className="word inline-block mr-[0.25em] opacity-20 transition-opacity duration-300"
                            >
                              {w}
                            </span>
                          ))}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* feather the top & bottom into the paper */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[30%]"
                style={{ background: `linear-gradient(to bottom, ${PAPER} 6%, rgba(230,213,193,0) 100%)` }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
                style={{ background: `linear-gradient(to top, ${PAPER} 6%, rgba(230,213,193,0) 100%)` }}
              />
            </div>

          </div>

          {/* reading progress under the sheet */}
          <div className="mt-8 h-px w-full max-w-[650px] bg-[rgba(232,220,200,0.16)] overflow-hidden">
            <div
              ref={fillRef}
              className="h-px bg-gradient-to-r from-[#F2A65C] to-[#C9401A]"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
