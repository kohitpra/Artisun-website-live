import { asset } from '@/lib/asset';

/**
 * Home-page preloader.
 *
 * The loading screen's percentage is driven by this, so whatever is listed here
 * is what a visitor WAITS FOR before they see the site. That makes the list a
 * performance budget, not a convenience — anything added here is added to the
 * time-to-first-paint of the whole brand.
 *
 * Kept deliberately to the media the first two screens actually paint with.
 * Everything below the fold streams in normally as the visitor scrolls, which
 * is what the browser is good at.
 */
const IMAGES = [
  asset('/Artisun Primary Logo.webp'),
  asset('/hero-mobile.webp'),
  asset('/Adjusting_head_direction_to_right_202608281524.webp'),
  asset('/Without bg.webp'),
];

/**
 * Warmed AFTER the reveal, not before it. These are the next things the visitor
 * scrolls into, so priming them costs nothing up front but means they are
 * already in cache by the time they are needed.
 */
const DEFERRED_IMAGES = [
  asset('/b1.webp'),
  asset('/b2.webp'),
  asset('/product-shots/origin-square.webp'),
  asset('/product-shots/aura-square.webp'),
  asset('/logo.png'),
  asset('/keyhole-bg.webp'),
  asset('/climate-weather/shimla.webp'),
  asset('/climate-weather/jaipur.webp'),
  asset('/climate-weather/bangalore.webp'),
  asset('/climate-weather/bombay.webp'),
];

export function preloadAll(onProgress: (progress: number) => void): Promise<void> {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalAssets = IMAGES.length;
    let isResolved = false;

    const warmDeferred = () => {
      // Fire-and-forget: no progress tracking, nothing blocks on these.
      DEFERRED_IMAGES.forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      });
    };

    const forceResolve = () => {
      if (isResolved) return;
      isResolved = true;
      onProgress(100);
      resolve();
      warmDeferred();
    };

    // The preloader must cap at <800ms total wall-clock time so visitors
    // never suffer conversion-dropping wait times. 450ms timeout + 250ms exit
    // animation guarantees the page is interactable within 700ms.
    const timer = setTimeout(forceResolve, 450);

    const updateProgress = () => {
      loadedCount++;
      if (isResolved) return;
      onProgress(Math.floor((loadedCount / totalAssets) * 100));
      if (loadedCount >= totalAssets) {
        clearTimeout(timer);
        forceResolve();
      }
    };

    if (totalAssets === 0) {
      forceResolve();
      return;
    }

    IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      img.onabort = updateProgress;
      img.src = src;
    });
  });
}
