'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from '@/components/media/SizedImage';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { asset } from '@/lib/asset';

/**
 * Artisun signup popup — "Your skin's forecast, in your inbox."
 *
 * Desktop: portrait photo left, form right.
 * Mobile:  bottom sheet — full-width, rounded top, photo on top, form below.
 *
 * Shows SHOW_AFTER_MS after the page loads. Closing it hides it for
 * DISMISS_DAYS; signing up hides it for good.
 *
 * Submits to /api/subscribe (lib/subscribe-handler.ts), which saves the email as a
 * Shopify customer subscribed to email marketing (tag: newsletter-popup).
 */

// ── Settings ──
const SHOW_AFTER_MS = 10_000;
const DISMISS_DAYS = 7;
const HIDDEN_ON = ['/privacy', '/terms', '/shipping-returns'];
const ENDPOINT = process.env.NEXT_PUBLIC_SUBSCRIBE_ENDPOINT || '/api/subscribe';
const IMG_DESKTOP = asset('/popup/popup-desktop.webp');
const IMG_MOBILE = asset('/popup/popup-mobile-gift.webp');

const STORAGE_KEY = 'artisun_signup_popup';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Stored = { status: 'subscribed' } | { status: 'dismissed'; at: number };

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStored(value: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked — popup may reappear next visit */
  }
}

function shouldShow(): boolean {
  const s = readStored();
  if (!s) return true;
  if (s.status === 'subscribed') return false;
  return Date.now() - s.at > DISMISS_DAYS * 86_400_000;
}

export default function SignupPopup() {
  const pathname = usePathname();
  const hiddenHere = HIDDEN_ON.some((p) => pathname?.startsWith(p));

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  // Open after 5 seconds — but never underneath the home page's loading
  // screen (z-index 1000). If the loader is still up at 5 s (slow mobile
  // data), wait for it to leave, then give the page a moment to settle.
  useEffect(() => {
    if (hiddenHere || !shouldShow()) return;
    let t = 0;
    const tryOpen = () => {
      if (document.querySelector('[data-loading-screen]')) {
        t = window.setTimeout(tryOpen, 500);
        return;
      }
      setOpen(true);
    };
    t = window.setTimeout(tryOpen, SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [hiddenHere]);

  const close = useCallback(() => {
    setOpen(false);
    if (status !== 'done') writeStored({ status: 'dismissed', at: Date.now() });
  }, [status]);

  // Esc closes, focus the email field, lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 400);
    // Lock both <html> and <body>: on desktop the window scrolls on <html>,
    // so locking <body> alone let the page scroll behind the popup.
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open, close]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setError('Enter a valid email address.');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, website, source: 'popup' }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Try again.');

      setStatus('done');
      writeStored({ status: 'subscribed' });
      window.gtag?.('event', 'generate_lead', { method: 'signup_popup' });
      window.fbq?.('track', 'Lead', { content_name: 'signup_popup' });
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  }

  if (hiddenHere) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="signup-popup"
          data-lenis-prevent=""
          className="fixed inset-0 z-[200] flex touch-none overscroll-none items-end justify-center bg-gradient-to-b from-[#751A19] via-[#AB2222] to-[#D8302C] sm:items-center sm:bg-none sm:bg-black/65 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-popup-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex max-h-[94svh] w-[92%] flex-col overflow-hidden overscroll-none rounded-none bg-[#A52A2C] text-white shadow-[0_-10px_40px_rgba(0,0,0,0.25)] sm:w-full sm:bg-[#F4EDE3] sm:text-[#180307] sm:h-[540px] sm:max-h-none sm:max-w-[900px] sm:flex-row sm:rounded-none sm:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Image: full-width 4:3 on mobile, left column on desktop */}
            <div className="relative aspect-[823/1002] max-h-[60svh] min-h-0 w-full shrink sm:aspect-auto sm:max-h-none sm:h-full sm:w-[380px] sm:shrink-0">
              <Image
                src={IMG_MOBILE}
                alt="Artisun Origin and Aura sunscreens on a glowing red surface"
                fill
                sizes="100vw"
                className="object-cover object-top sm:hidden"
                priority
              />
              <Image
                src={IMG_DESKTOP}
                alt=""
                aria-hidden="true"
                fill
                sizes="380px"
                className="hidden object-cover object-[50%_20%] sm:block"
                priority
              />
            </div>

            {/* Content: below the photo on mobile (centred), right column on desktop */}
            <div className="flex flex-none flex-col justify-center overflow-hidden px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 text-center font-suisse sm:flex-1 sm:overflow-y-auto sm:h-full sm:px-[52px] sm:py-12 sm:text-left">
              {status === 'done' ? (
                <div className="flex flex-col gap-3">
                  <h2
                    id="signup-popup-title"
                    className="m-0 font-editorial text-[30px] font-normal leading-[1.02] sm:text-[44px]"
                  >
                    You&rsquo;re in.
                  </h2>
                  <p className="m-0 text-[13.5px] leading-[1.55] text-white/90 sm:text-[#4a3a33] sm:text-[14.5px]">
                    Your first forecast is on its way. Watch your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 h-11 w-full bg-[#881A1B] text-[15px] font-normal tracking-[0.04em] text-white transition-colors hover:bg-[#731517] sm:h-[50px] sm:bg-[#A52A2C] sm:text-[13px] sm:font-medium sm:tracking-[0.18em] sm:text-[#FAF6EE] sm:hover:bg-[#8e2325]"
                  >
                    KEEP BROWSING
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    id="signup-popup-title"
                    className="m-0 mb-2 font-editorial text-[clamp(18px,5.6vw,28px)] font-normal leading-[1.1] [text-wrap:balance] tracking-[-0.01em] sm:mb-[14px] sm:text-[40px] sm:leading-[1.05]"
                  >
                    <span className="sm:hidden">Your skin&rsquo;s forecast in your inbox</span>
                    <span className="hidden sm:inline">
                      Your skin&rsquo;s forecast,
                      <br />
                      in your inbox.
                    </span>
                  </h2>
                  <p className="m-0 mb-5 text-[14px] leading-[1.45] text-white sm:mb-[22px] sm:text-[14.5px] sm:leading-[1.55] sm:text-[#4a3a33]">
                    {/* Shorter copy on mobile, full copy on desktop */}
                    <span className="sm:hidden">
                      Sign up and we&rsquo;ll help you wear sunscreen right.
                      <br />
                      Plus, first access to everything new!
                    </span>
                    <span className="hidden sm:inline">
                      Sign up and we&rsquo;ll help you wear it right - the number of pearls for today, when to
                      reapply, what your city&rsquo;s doing to your skin. Plus first access to everything new.
                    </span>
                  </p>

                  <form onSubmit={submit} noValidate className="flex flex-col gap-[10px]">
                    <label htmlFor="signup-popup-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      ref={emailRef}
                      id="signup-popup-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'signup-popup-error' : undefined}
                      className="h-11 w-full rounded-none border border-white/30 bg-white/30 px-[14px] text-[16px] text-white outline-none backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_rgba(0,0,0,0.08)] transition-colors placeholder:text-white/70 focus:border-white/70 focus:bg-white/35 sm:h-12 sm:border-[#cbbba9] sm:bg-white sm:text-[15px] sm:text-[#180307] sm:backdrop-blur-none sm:shadow-none sm:placeholder:text-[#8a7a70] sm:focus:border-[#180307] sm:focus:bg-white"
                    />

                    {/* Honeypot — hidden from people, bots fill it in */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {error && (
                      <p id="signup-popup-error" role="alert" className="m-0 text-[13px] text-[#FFE1DC] sm:text-[#A52A2C]">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="mt-1 h-11 w-full bg-[#881A1B] text-[15px] font-normal tracking-[0.04em] text-white transition-colors hover:bg-[#731517] disabled:opacity-70 sm:h-[50px] sm:bg-[#A52A2C] sm:text-[13px] sm:font-medium sm:tracking-[0.18em] sm:text-[#FAF6EE] sm:hover:bg-[#8e2325]"
                    >
                      {status === 'sending' ? 'SIGNING YOU UP…' : 'START NOW'}
                    </button>
                  </form>

                  <p className="m-0 mt-3 text-[10.5px] leading-[1.45] text-white/60 sm:mt-4 sm:text-[12px] sm:leading-[1.5] sm:text-[#6e5e55]">
                    By signing up you agree to receive marketing emails from Artisun. Unsubscribe anytime. See
                    our{' '}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-white sm:hover:text-[#A52A2C]">
                      privacy policy
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center bg-transparent text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-opacity hover:opacity-80 sm:right-2 sm:top-2 sm:text-[#180307] sm:drop-shadow-none"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
