'use client';

import { RefObject, useEffect } from 'react';

/**
 * usePanelEdgeScroll
 * ------------------
 * The Origin / Aura pages pin a horizontal track: vertical page-scroll drives
 * the sideways movement between sections. Some sections carry more copy than
 * fits on one screen (the product hero, the buy panel, the FAQ). For those we
 * want the WHOLE section — image and text together — to scroll vertically first,
 * and only once it bottoms out (or tops out) should the gesture spill over into
 * the horizontal track and reveal the next / previous section.
 *
 * Attaching this to the panel's scroll container gives exactly that:
 *  • while there's room to scroll inside → the wheel/touch scrolls the content
 *    (and is stopped from reaching Lenis, so the track doesn't move);
 *  • at the top or bottom edge → the gesture is released, so Lenis (wheel) or
 *    native scroll-chaining (touch) carries on into the horizontal track.
 *
 * When the content fits (e.g. desktop, where everything is on-screen) the hook
 * is inert: there's nothing to scroll, so every gesture passes straight through
 * to the horizontal track as before.
 */
export function usePanelEdgeScroll(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean = true
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const EDGE = 1; // px tolerance for "at the edge"
    const canScroll = () => el.scrollHeight - el.clientHeight > 2;
    const atTop = () => el.scrollTop <= EDGE;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE;

    // ── Wheel / trackpad (desktop) ──
    const onWheel = (e: WheelEvent) => {
      if (!canScroll()) return; // nothing to scroll → let the page/track take it
      const down = e.deltaY > 0;
      if ((down && atBottom()) || (!down && atTop())) return; // edge → release
      // consume internally; stop it reaching Lenis so the track stays put
      e.stopPropagation();
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };

    // ── Touch (mobile / tablet) ──
    // Native scrolling handles the interior smoothly; we only need to keep the
    // gesture from reaching Lenis mid-content. At the edges we let it go so the
    // browser chains into the document (which advances the horizontal track).
    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!canScroll()) return;
      const y = e.touches[0]?.clientY ?? lastY;
      const down = lastY - y > 0; // finger up → content scrolls down
      lastY = y;
      if ((down && atBottom()) || (!down && atTop())) return; // edge → chain out
      e.stopPropagation();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [ref, enabled]);
}
