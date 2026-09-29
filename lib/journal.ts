/**
 * Artifacts (the Journal) — pulled live from the Shopify blog.
 *
 * Write and edit posts in Shopify admin → Online Store → Blog posts, in the
 * "Artifacts" blog. This site reads them through the Storefront API; nothing
 * about a post lives in this repo.
 *
 * WHEN CHANGES APPEAR
 *   Netlify (server build)   pages re-fetch at most every REVALIDATE seconds,
 *                            so a new or edited post shows up within ~5 min.
 *   GitHub Pages (static)    content is baked in at build time. The deploy
 *                            workflow rebuilds on a schedule and on demand
 *                            (Actions → Deploy to GitHub Pages → Run workflow).
 *
 * REQUIREMENTS
 *   - The same NEXT_PUBLIC_SHOPIFY_DOMAIN / NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN the
 *     cart uses (see lib/shopify.ts).
 *   - Headless channel → Storefront API permissions → "Read content like
 *     articles, blogs, and comments" (unauthenticated_read_content) enabled.
 *   - Optional custom metafields (answer_block, author_role, reviewed_by,
 *     sources, faq) must have "Storefronts" access turned on in
 *     Settings → Custom data → Blog posts, or the API returns them as null.
 *
 * This module runs on the server only (build time / ISR). It never ships to
 * the browser.
 */
import { BASE_PATH } from './asset';
import { sanitizeContentHtml } from './sanitize-content';
import type { FaqItem, JournalArticle, JournalCard, JournalImage, TocItem } from './journal-shared';

export * from './journal-shared';

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? '';
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_TOKEN ?? '';
const ENDPOINT = `https://${DOMAIN}/api/2025-01/graphql.json`;

/** Blog handle in Shopify — the URL segment in /blogs/<handle>. */
export const BLOG_HANDLE = process.env.NEXT_PUBLIC_SHOPIFY_BLOG_HANDLE || 'artifacts';

/** Seconds between re-fetches on a server deploy (ignored by static export). */
export const REVALIDATE = 300;

export const journalConfigured = Boolean(DOMAIN && TOKEN);

/* ─────────────────────────── fetch ─────────────────────────── */

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE, tags: ['journal'] },
  });

  if (!res.ok) {
    throw new Error(
      res.status === 401 || res.status === 403
        ? 'Shopify rejected the Storefront token while loading the Journal. Check the token, and that the Headless channel has "Read content like articles, blogs, and comments" enabled.'
        : `Shopify responded ${res.status} while loading the Journal.`,
    );
  }
  const json = await res.json();
  if (json.errors?.length) throw new Error(`Journal: ${json.errors[0].message}`);
  return json.data as T;
}

const CARD_FIELDS = /* GraphQL */ `
  fragment JournalCardFields on Article {
    handle
    title
    tags
    excerpt
    publishedAt
    content
    image {
      url(transform: { maxWidth: 800 })
      altText
      width
      height
    }
  }
`;

type RawCard = Omit<JournalCard, 'minutes' | 'excerpt'> & {
  excerpt: string | null;
  content: string;
};

type RawMetafield = { key: string; type: string; value: string } | null;

type RawArticle = RawCard & {
  contentHtml: string;
  authorV2: { name: string } | null;
  seo: { title: string | null; description: string | null } | null;
  metafields: RawMetafield[];
};

const toCard = (a: RawCard): JournalCard => ({
  handle: a.handle,
  title: a.title,
  tags: a.tags ?? [],
  excerpt: (a.excerpt ?? '').trim(),
  publishedAt: a.publishedAt,
  minutes: readingMinutes(a.content),
  image: a.image,
});

/** Every post in the blog, newest first. Empty if Shopify isn't configured. */
export async function getJournalArticles(): Promise<JournalCard[]> {
  if (!journalConfigured) {
    console.warn('[journal] Shopify env vars missing — the Journal will render empty.');
    return [];
  }

  const cards: JournalCard[] = [];
  let cursor: string | null = null;

  // Paged so a blog past 100 posts still comes through whole.
  for (let page = 0; page < 20; page++) {
    const data: {
      blog: {
        articles: {
          nodes: RawCard[];
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
      } | null;
    } = await gql(
      `${CARD_FIELDS}
       query JournalList($handle: String!, $cursor: String) {
         blog(handle: $handle) {
           articles(first: 100, after: $cursor, sortKey: PUBLISHED_AT, reverse: true) {
             nodes { ...JournalCardFields }
             pageInfo { hasNextPage endCursor }
           }
         }
       }`,
      { handle: BLOG_HANDLE, cursor },
    );

    if (!data.blog) {
      throw new Error(
        `Journal: no blog with handle "${BLOG_HANDLE}" is visible to the Storefront API. Check NEXT_PUBLIC_SHOPIFY_BLOG_HANDLE.`,
      );
    }
    cards.push(...data.blog.articles.nodes.map(toCard));
    if (!data.blog.articles.pageInfo.hasNextPage) break;
    cursor = data.blog.articles.pageInfo.endCursor;
  }

  return cards;
}

const METAFIELD_KEYS = ['answer_block', 'author_role', 'reviewed_by', 'sources', 'faq'];

/**
 * Shopify article handles are letters, digits, hyphens and underscores.
 * Anything else in /blog/[handle] is junk or a probe, and is rejected before a
 * Storefront API request is made for it.
 */
export function isValidHandle(handle: unknown): handle is string {
  return typeof handle === 'string' && handle.length > 0 && handle.length <= 255 && /^[a-z0-9][a-z0-9_-]*$/i.test(handle);
}

/** One post by handle, or null if it doesn't exist. */
export async function getJournalArticle(handle: string): Promise<JournalArticle | null> {
  if (!journalConfigured || !isValidHandle(handle)) return null;

  const data = await gql<{ blog: { articleByHandle: RawArticle | null } | null }>(
    `${CARD_FIELDS}
     query JournalArticle($blog: String!, $handle: String!, $ids: [HasMetafieldsIdentifier!]!) {
       blog(handle: $blog) {
         articleByHandle(handle: $handle) {
           ...JournalCardFields
           contentHtml
           authorV2 { name }
           seo { title description }
           image {
             url(transform: { maxWidth: 800 })
             large: url(transform: { maxWidth: 1200 })
             altText
             width
             height
           }
           metafields(identifiers: $ids) { key type value }
         }
       }
     }`,
    {
      blog: BLOG_HANDLE,
      handle,
      ids: METAFIELD_KEYS.map((key) => ({ namespace: 'custom', key })),
    },
  );

  const a = data.blog?.articleByHandle;
  if (!a) return null;

  const meta = Object.fromEntries(
    (a.metafields ?? []).filter(Boolean).map((m) => [m!.key, m!]),
  ) as Record<string, { type: string; value: string }>;

  const { html, toc } = processContent(a.contentHtml);
  const { name: authorName, role: authorRoleFromName } = splitAuthor(a.authorV2?.name);

  return {
    ...toCard(a),
    author: authorName,
    seoTitle: a.seo?.title || null,
    seoDescription: a.seo?.description || null,
    image: a.image,
    html,
    plainText: stripJsonLdText(a.content),
    toc,
    answerBlock: metaText(meta.answer_block),
    // The author_role metafield wins; otherwise use the role written into the
    // Shopify author field ("Name — Role").
    authorRole: metaText(meta.author_role) || authorRoleFromName,
    reviewedBy: metaText(meta.reviewed_by),
    sourcesHtml: meta.sources ? metaHtml(meta.sources) : null,
    faq: metaFaq(meta.faq),
  };
}

/* ────────────────────── content helpers ────────────────────── */

/** Same rule as the Liquid template: words ÷ 220, floored, minimum 1. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.floor(words / 220));
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…',
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

const stripTags = (s: string) => decodeEntities(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

function slugify(text: string, used: Set<string>): string {
  const base =
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'section';
  let slug = base;
  let i = 1;
  while (used.has(slug)) slug = `${base}-${++i}`;
  used.add(slug);
  return slug;
}

// Static exports are served with trailingSlash: true; match it so in-post
// links don't bounce through a redirect.
const SLASH = process.env.STATIC_EXPORT === '1' ? '/' : '';

// The lookahead stops look-alike hosts such as artisunskin.com.evil.example
// from being treated as our own domain.
const SHOP_HOST = /^https?:\/\/(?:www\.|checkout\.)?artisunskin\.com(?=[/?#]|$)/i;

/**
 * Point shop URLs inside post content at this site. Posts link to each other
 * as /blogs/artifacts/<handle> (often with the full shop domain); those
 * become /blog/<handle>. Product and collection links map to their pages
 * here. Outside links open in a new tab.
 */
function rewriteHref(href: string): { href: string; external: boolean } {
  const raw = decodeEntities(href.trim());
  if (/^(#|mailto:|tel:)/i.test(raw)) return { href: raw, external: false };
  // Only http(s) and site-relative paths are real links. javascript:, data:,
  // protocol-relative //host and anything else are neutralised.
  if (!/^https?:\/\//i.test(raw) && !/^\/(?!\/)/.test(raw)) return { href: '#', external: false };

  const isShop = SHOP_HOST.test(raw) || raw.startsWith('/');
  if (!isShop) return { href: raw, external: /^https?:\/\//i.test(raw) };

  const path = raw.replace(SHOP_HOST, '') || '/';
  const [pathname, rest = ''] = path.split(/(?=[?#])/);
  const suffix = rest.startsWith('#') ? rest : ''; // keep anchors, drop shop query strings

  const blog = pathname.match(new RegExp(`^/blogs/${BLOG_HANDLE}/?([^/]*)`));
  if (blog) return { href: `${BASE_PATH}/blog${blog[1] ? `/${blog[1]}` : ''}${SLASH}${suffix}`, external: false };

  const product = pathname.match(/^\/products\/(origin|aura)/i);
  if (product) return { href: `${BASE_PATH}/${product[1].toLowerCase()}${SLASH}`, external: false };

  if (/^\/collections(\/|$)/.test(pathname)) return { href: `${BASE_PATH}/all-products${SLASH}`, external: false };

  // Anything else on the shop domain (policies, pages) stays on the shop.
  return { href: `https://checkout.artisunskin.com${path}`, external: true };
}

function processLinks(html: string): string {
  return html.replace(/<a\b([^>]*?)href=(["'])(.*?)\2([^>]*)>/gi, (_m, pre: string, q: string, href: string, post: string) => {
    const { href: next, external } = rewriteHref(href);
    let attrs = `${pre}href=${q}${next.replace(/"/g, '&quot;')}${q}${post}`;
    if (external && !/\btarget=/i.test(attrs)) attrs += ' target="_blank" rel="noopener noreferrer"';
    return `<a${attrs}>`;
  });
}

/**
 * Shopify's author field holds "Name — Role" in one string, e.g.
 * "Dr. Reetu Durga — Aesthetician and Founder, Skulpted by Kan".
 * Split on the first spaced em/en dash (or spaced hyphen) so the schema gets
 * a clean Person.name and a separate jobTitle.
 */
export function splitAuthor(raw?: string | null): { name: string; role: string | null } {
  const full = (raw ?? '').trim();
  if (!full) return { name: 'Artisun Skinwear', role: null };
  const m = full.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  return m ? { name: m[1].trim(), role: m[2].trim() } : { name: full, role: null };
}

/**
 * Some article bodies in Shopify carry their own <script type="application/ld+json">
 * from the old theme (old URLs, duplicate Article schema). Drop them — the page
 * renders its own Article/FAQ/Breadcrumb schema.
 */
export function stripJsonLd(html: string): string {
  return html.replace(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>[\s\S]*?<\/script>/gi, '');
}

/** Same clean-up for Shopify's plain-text `content`, where the tags are gone
 *  but the JSON text of an embedded schema can remain. */
function stripJsonLdText(text: string): string {
  let out = text ?? '';
  const re = /\{\s*"@context"\s*:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(out))) {
    // Walk to the matching closing brace (ignoring braces inside strings).
    let depth = 0;
    let inStr = false;
    let i = m.index;
    for (; i < out.length; i++) {
      const ch = out[i];
      if (inStr) {
        if (ch === '\\') i++;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === '{') depth++;
      else if (ch === '}' && --depth === 0) break;
    }
    if (depth !== 0) break; // unbalanced: leave the text alone
    out = out.slice(0, m.index) + out.slice(i + 1);
    re.lastIndex = m.index;
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

/** Give every h2 an id and collect them for "In this article". */
export function processContent(contentHtml: string): { html: string; toc: TocItem[] } {
  const used = new Set<string>();
  const toc: TocItem[] = [];

  const withIds = stripJsonLd(contentHtml).replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs: string, inner: string) => {
    const label = stripTags(inner);
    if (!label) return `<h2${attrs}>${inner}</h2>`;
    const existing = attrs.match(/\bid=(["'])(.*?)\1/i)?.[2];
    const id = existing && !used.has(existing) ? (used.add(existing), existing) : slugify(label, used);
    toc.push({ id, label });
    const cleanAttrs = attrs.replace(/\s*\bid=(["']).*?\1/i, '');
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });

  // Sanitise last, after every rewrite, so nothing added above can slip past.
  return { html: sanitizeContentHtml(processLinks(withIds)), toc };
}

/* ─────────────────────── metafield helpers ─────────────────────── */

function metaText(m?: { type: string; value: string }): string | null {
  if (!m?.value) return null;
  if (m.type === 'rich_text_field') return stripTags(richTextToHtml(m.value)) || null;
  return m.value.trim() || null;
}

function metaHtml(m: { type: string; value: string }): string | null {
  const html = metaHtmlRaw(m);
  return html ? sanitizeContentHtml(html) : null;
}

function metaHtmlRaw(m: { type: string; value: string }): string | null {
  if (!m.value) return null;
  if (m.type === 'rich_text_field') return processLinks(richTextToHtml(m.value));
  if (m.type === 'multi_line_text_field') {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return m.value.split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('');
  }
  return processLinks(m.value);
}

function metaFaq(m?: { type: string; value: string }): FaqItem[] {
  if (!m?.value) return [];
  try {
    const parsed = JSON.parse(m.value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => ({ question: String(x?.question ?? ''), answer: String(x?.answer ?? '') }))
      .filter((x) => x.question && x.answer);
  } catch {
    return [];
  }
}

/** Minimal renderer for Shopify's rich_text_field JSON. */
type RtNode = {
  type: string;
  children?: RtNode[];
  value?: string;
  level?: number;
  listType?: string;
  url?: string;
  bold?: boolean;
  italic?: boolean;
};

function richTextToHtml(json: string): string {
  let root: RtNode;
  try {
    root = JSON.parse(json);
  } catch {
    return json;
  }
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const walk = (n: RtNode): string => {
    const kids = (n.children ?? []).map(walk).join('');
    switch (n.type) {
      case 'root': return kids;
      case 'paragraph': return `<p>${kids}</p>`;
      case 'heading': return `<h${n.level ?? 3}>${kids}</h${n.level ?? 3}>`;
      case 'list': return n.listType === 'ordered' ? `<ol>${kids}</ol>` : `<ul>${kids}</ul>`;
      case 'list-item': return `<li>${kids}</li>`;
      case 'link': return `<a href="${esc(n.url ?? '#')}">${kids}</a>`;
      case 'text': {
        let t = esc(n.value ?? '');
        if (n.bold) t = `<strong>${t}</strong>`;
        if (n.italic) t = `<em>${t}</em>`;
        return t;
      }
      default: return kids;
    }
  };
  return walk(root);
}
