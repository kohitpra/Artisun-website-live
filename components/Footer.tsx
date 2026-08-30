'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';

const quickLinks: { label: string; href: string }[] = [
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact', href: '/about' },
  { label: 'Blog', href: '/about' },
];
const policyLinks: { label: string; href: string }[] = [
  { label: 'Privacy Policy', href: '/privacypolicy' },
  { label: 'Shipping Policy', href: '/privacypolicy' },
  { label: 'Refunds & Cancellations', href: '/privacypolicy' },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7.2" cy="7.4" r="1.15" fill="currentColor" />
      <rect x="6.1" y="10.4" width="2.2" height="7.2" fill="currentColor" />
      <path d="M11.3 10.4h2.1v1.05c.55-.75 1.35-1.25 2.55-1.25 1.95 0 3.05 1.3 3.05 3.55v4.85h-2.2v-4.4c0-1.1-.4-1.85-1.4-1.85-.75 0-1.2.5-1.4 1-.07.18-.09.42-.09.67v4.58h-2.2c.03-6.4 0-7.2 0-9.2Z" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const containerRef = useRef<HTMLElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ── ENTRY: Diagonal Wipe — applied to the content wrapper only, never
      // the footer element itself, so the background gradient stays fully
      // painted and flows continuously from CTASection above instead of
      // clipping away to reveal the page's raw background underneath. ──
     

      // REMOVED clipPath wipe - ye hi footer kaat raha tha


      gsap.fromTo(
        '.footer-reveal',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 70%' },
        }
      );

     
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full overflow-visible z-10"
      style={{
        background: isHome
          ? 'linear-gradient(180deg, #56190C 0%, #4C130A 20%, #3D0F09 42%, #2E0B07 64%, #200705 84%, #170402 100%)'
          : 'linear-gradient(180deg, #F08D2C 0%, #C93B1A 45%, #7A1910 85%, #4C130A 100%)',
      }}
    >
      {/* Same slow flowing light sweep as CTASection, so the gradient reads
          as one continuous, living surface across both sections. Only on home page. */}
      {isHome && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            left: '-10vw',
            width: '120vw',
            background: 'radial-gradient(ellipse at 50% 10%, rgba(255,150,60,0.08), transparent 55%)',
            mixBlendMode: 'screen',
            animation: 'moveLightX 25s ease-in-out infinite reverse',
          }}
        />
      )}

      <div ref={contentWrapRef} className="w-full flex items-center justify-center">
              <div className="relative z-10 px-6 md:px-12 lg:px-20 py-14 md:py-16 lg:py-20 w-full overflow-visible">
        <div className="flex flex-col md:flex-row md:justify-between gap-14 md:gap-8">

          {/* Quick Links + Policies */}
          <div className="flex gap-16 sm:gap-20 lg:gap-28 footer-reveal">
            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="font-suisse text-lg md:text-xl lg:text-2xl text-[var(--brand-cream)] font-medium leading-[1.3] overflow-visible pt-1">
                Quick Links
              </h4>
              {quickLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 hover:text-white transition-colors duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="font-suisse text-lg md:text-xl lg:text-2xl text-[var(--brand-cream)] font-medium leading-[1.3] overflow-visible pt-1">
                Policies
              </h4>
              {policyLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 hover:text-white transition-colors duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials + Newsletter */}
          <div className="flex flex-col items-start md:items-end gap-4 md:gap-5 md:max-w-sm lg:max-w-md footer-reveal">
            <div className="flex gap-3">
              <a
                href="https://instagram.com/artisunskinwear"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="shrink-0 w-8 h-8 md:w-9 md:h-9 text-[var(--brand-cream)] hover:text-white transition-colors duration-300"
              >
                <InstagramIcon />
              </a>
            </div>

            <p className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 text-left md:text-right leading-snug">
              Be the first to experience new launches, exclusive offers and the future of Skinwear.
            </p>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full sm:w-80 md:w-full lg:w-96 bg-[var(--brand-cream)] text-[#C02D19] placeholder:text-[#C02D19] rounded-full px-6 py-3 md:py-3.5 text-sm md:text-base font-suisse outline-none"
            />
          </div>
        </div>
      </div>

      
      </div>
    </footer>
  );
}
