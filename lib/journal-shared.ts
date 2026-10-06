/**
 * Journal types and pure formatting helpers. Safe to import from client
 * components — no fetching, no env. The Shopify fetch layer is lib/journal.ts.
 */

/* ─────────────────────────── types ─────────────────────────── */

export type JournalImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  /** 1200px version, for social cards and schema (article pages only). */
  large?: string;
};

export type JournalCard = {
  handle: string;
  title: string;
  tags: string[];
  excerpt: string;
  publishedAt: string;
  minutes: number;
  image: JournalImage | null;
};

export type TocItem = { id: string; label: string };

export type FaqItem = { question: string; answer: string };

export type JournalArticle = JournalCard & {
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
  /** Content HTML with heading ids added and shop links pointed at this site. */
  html: string;
  plainText: string;
  toc: TocItem[];
  answerBlock: string | null;
  authorRole: string | null;
  reviewedBy: string | null;
  sourcesHtml: string | null;
  /** FAQ from the `faq` metafield — rendered as the visible "Frequently asked" block. */
  faq: FaqItem[];
  /**
   * FAQ used for the FAQPage schema: the metafield FAQ if set, otherwise the
   * FAQPage JSON-LD written into the post body in Shopify (which is stripped
   * from the rendered HTML, so it must be re-emitted by the page).
   */
  schemaFaq: FaqItem[];
};

/** Liquid's `truncate: 90` — total length 90 including the "...". */
export function truncate(text: string, length = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= length ? clean : `${clean.slice(0, length - 3)}...`;
}

const TZ = 'Asia/Kolkata';
export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: TZ }).format(new Date(iso));
export const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric', timeZone: TZ }).format(new Date(iso));

/** The five pillars used for filtering, matching the Shopify template. */
export const PILLARS = ['Weather & Climate', 'Wear & Feel', 'Protection', 'Ingredients', 'Skinwear'] as const;

/** Card colour, keyed on the post's first tag (same mapping as the theme). */
export function cardFlavor(tags: string[]): string {
  switch (tags[0]) {
    case 'Weather & Climate': return 'f-red';
    case 'Wear & Feel': return 'f-ink';
    case 'Protection': return 'f-clay';
    case 'Ingredients': return 'f-cream';
    case 'Skinwear': return 'f-paper';
    default: return 'f-red';
  }
}
