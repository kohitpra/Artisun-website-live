'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from '@/components/media/SizedImage';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '@/lib/asset';
import Turnstile from '@/components/Turnstile';

const quickLinks: { label: string; href: string }[] = [
  { label: 'Shop All', href: '/all-products' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Artifacts by Artisun', href: '/blog' },
];

const policyLinks: { label: string; href: string }[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className="w-full h-full">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const containerRef = useRef<HTMLElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;
    const el = containerRef.current;

    // ── ENTRY: reveal driven by IntersectionObserver instead of a
    // window-scroller ScrollTrigger. Several pages now scroll inside a
    // fixed mobile container ([data-scroll-frame] / Origin's snap
    // container) where the window never scrolls, so a window-based
    // trigger would never fire and the footer would stay invisible.
    // IO measures against the visual viewport regardless of which
    // element does the scrolling, so the same animation works
    // everywhere — same 'top bottom', once-only behavior as before. ──
    const ctx = gsap.context(() => {
      gsap.set('.footer-reveal', { y: 24, opacity: 0 });
    }, containerRef);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        gsap.to(el.querySelectorAll('.footer-reveal'), {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
      { threshold: 0 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full overflow-visible z-10"
      style={{
        background:
          'linear-gradient(180deg, #56190C 0%, #4C130A 20%, #3D0F09 42%, #2E0B07 64%, #200705 84%, #170402 100%)',
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
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-10 md:pt-12 pb-4 md:pb-5 w-full overflow-visible">
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
                    className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 hover:text-[#E8DCC8] transition-colors duration-300 w-fit"
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
                    className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 hover:text-[#E8DCC8] transition-colors duration-300 w-fit"
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
                  className="shrink-0 w-8 h-8 md:w-9 md:h-9 text-[var(--brand-cream)] hover:text-[#E8DCC8] transition-colors duration-300"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://wa.me/917982605517"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="shrink-0 w-8 h-8 md:w-9 md:h-9  transition-colors duration-300"
                >
                  <WhatsAppIcon />
                </a>
              </div>

              <p className="font-suisse text-sm md:text-base lg:text-lg text-[var(--brand-cream)]/90 text-left md:text-right leading-snug">
                Be the first to experience new launches, exclusive offers and the future of Skinwear.
              </p>

              {newsletterStatus === 'success' ? (
                <div className="w-full sm:w-80 md:w-full lg:w-96 p-4 rounded-xl bg-white/10 border border-white/20 text-[var(--brand-cream)] font-suisse text-sm">
                  <p className="font-medium text-emerald-300">✓ You are on the Artisun list.</p>
                  <p className="text-xs text-[var(--brand-cream)]/80 mt-1">Thank you for subscribing. You will be the first to receive updates on new drops & formula launches.</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    if (!newsletterEmail || !newsletterEmail.includes('@')) {
                      setNewsletterStatus('error');
                      setErrorMessage('Please enter a valid email address.');
                      return;
                    }
                    if (!marketingConsent) {
                      setNewsletterStatus('error');
                      setErrorMessage('Please check the consent box to receive updates as per privacy regulations.');
                      return;
                    }
                    // Previously this showed "success" without sending the email anywhere.
                    // It now saves the signup to Shopify, same as the popup.
                    try {
                      const res = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: newsletterEmail.trim(), source: 'footer', turnstileToken }),
                      });
                      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
                      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
                      setNewsletterStatus('success');
                      setErrorMessage('');
                      window.gtag?.('event', 'generate_lead', { method: 'footer_newsletter' });
                      window.fbq?.('track', 'Lead', { content_name: 'footer_newsletter' });
                      (form.querySelector('input') as HTMLInputElement | null)?.blur();
                    } catch (err) {
                      setNewsletterStatus('error');
                      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
                      setTurnstileReset((n) => n + 1); // tokens are single-use
                    }
                  }}
                  className="w-full sm:w-80 md:w-full lg:w-96 flex flex-col"
                >
                  <div className="relative w-full">
                    <input
                      type="email"
                      name="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') setNewsletterStatus('idle');
                      }}
                      autoComplete="email"
                      placeholder="Enter Email"
                      style={{ fontSize: '16px' }}
                      onBlur={() => {
                        // No viewport/zoom tricks here: the input is 16px, which already
                        // stops iOS auto-zooming on focus, and pinch-zoom must stay enabled.
                        window.scrollTo({ top: window.scrollY, behavior: 'smooth' });
                      }}
                      className="w-full bg-[var(--brand-cream)] text-[#C02D19] placeholder:text-[#C02D19] rounded-full px-6 py-3 md:py-3.5 text-base font-suisse outline-none touch-manipulation"
                    />
                  </div>

                  <Turnstile onToken={setTurnstileToken} resetKey={turnstileReset} className="mt-3" />

                  {/* DPDP Act & GDPR Affirmative Marketing Opt-in Checkbox */}
                  <label className="flex items-start gap-2 mt-3 text-left cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      id="newsletter-dpdp-optin"
                      checked={marketingConsent}
                      onChange={(e) => {
                        setMarketingConsent(e.target.checked);
                        if (newsletterStatus === 'error') setNewsletterStatus('idle');
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-white/30 bg-black/20 text-[#C02D19] focus:ring-[#C02D19] accent-[#C02D19] cursor-pointer shrink-0"
                    />
                    <span className="font-suisse text-[11px] sm:text-xs text-[var(--brand-cream)]/75 leading-tight group-hover:text-[var(--brand-cream)] transition-colors">
                      I agree to receive news, launches, and promotional emails from Artisun in accordance with the{' '}
                      <Link href="/privacy" className="underline hover:text-[#E8DCC8] transition-colors">Privacy Policy</Link>.
                    </span>
                  </label>

                  {newsletterStatus === 'error' && (
                    <p className="font-suisse text-xs text-rose-300 mt-2 text-left">
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Bottom Legal & Grievance Redressal */}
          <div className="pt-10 md:pt-12 pb-2 border-t border-white/10 mt-10 flex flex-col md:flex-row items-center justify-between gap-4 footer-reveal font-suisse text-[11px] text-[var(--brand-cream)]/60">
            <p className="tracking-wider uppercase">
              © Artisun Private Limited 2026
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-center md:text-right">
              <a
                href="mailto:support@artisunskin.com"
                className="underline hover:text-[#E8DCC8] transition-colors"
              >
                support@artisunskin.com
              </a>
              <span>·</span>
              <span>Response &lt; 48h</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
