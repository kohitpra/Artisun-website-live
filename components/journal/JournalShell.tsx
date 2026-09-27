'use client';

import GlobalHeader from '@/components/GlobalHeader';
import Footer from '@/components/Footer';
import MobileScrollFrame from '@/components/MobileScrollFrame';

/**
 * Page chrome for the Journal: the site's Red Eclipse background, header and
 * footer around a paper sheet that holds the Journal itself. The custom
 * cursor is deliberately left out — reading pages use the native cursor
 * (see journal.css).
 */
export default function JournalShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="journal-page relative w-full min-h-screen overflow-x-clip">
      {/* Kept outside the scroll frame: iOS treats position:fixed inside a
          touch scroll container as absolute. */}
      <div className="artisun-bg" aria-hidden />
      <GlobalHeader />
      <MobileScrollFrame>
        <div className="journal-page-inner">{children}</div>
        <Footer />
      </MobileScrollFrame>
    </main>
  );
}
