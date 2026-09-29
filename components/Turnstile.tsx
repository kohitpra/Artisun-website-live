'use client';

/**
 * Cloudflare Turnstile bot check for the newsletter forms.
 *
 * Off by default: renders nothing unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set
 * at build time. Turn it on by setting BOTH
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   (public, build time)
 *   TURNSTILE_SECRET_KEY             (secret, server runtime)
 * from Cloudflare dashboard → Turnstile → Add site (free, no Cloudflare DNS needed).
 *
 * "interaction-only" keeps it invisible for most visitors; a checkbox appears
 * only when Cloudflare wants a closer look. Tokens are single-use, so the
 * parent should bump `resetKey` after a failed submit to get a fresh one.
 */
import { useEffect, useRef } from 'react';

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error('Turnstile failed to load'));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export default function Turnstile({
  onToken,
  resetKey = 0,
  theme = 'light',
  className,
}: {
  onToken: (token: string) => void;
  resetKey?: number;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !box.current) return;
    let widgetId: string | null = null;
    let cancelled = false;
    cb.current('');

    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widgetId = window.turnstile.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          appearance: 'interaction-only',
          callback: (t: string) => cb.current(t),
          'expired-callback': () => cb.current(''),
          'error-callback': () => cb.current(''),
        });
      })
      .catch((err) => console.warn(err));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [resetKey, theme]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={box} className={className} />;
}
