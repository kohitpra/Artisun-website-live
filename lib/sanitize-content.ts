/**
 * Allowlist HTML sanitizer for Journal content pulled from Shopify.
 *
 * Blog bodies and the `sources` metafield are rendered with
 * dangerouslySetInnerHTML. They come from Shopify admin, which is trusted
 * *today* — but a compromised staff account, a pasted embed, or an app that
 * writes to articles would otherwise be able to run script on
 * artisunskin.com (stored XSS). Everything is therefore reduced to a known-safe
 * subset of HTML here, on the server, before it reaches the page.
 *
 * - No <script>, <style>, <form>, <object>, <embed>, event handlers (on*=).
 * - Links: only http(s), mailto, tel, relative and #anchors. `javascript:`,
 *   `data:` and `vbscript:` hrefs are dropped.
 * - Images: https only (http is upgraded).
 * - <iframe>: YouTube / Vimeo embeds only.
 * - target="_blank" always gets rel="noopener noreferrer".
 *
 * Runs at build/ISR time only — never shipped to the browser.
 */
import sanitizeHtml from 'sanitize-html';

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'span', 'div', 'section', 'article', 'blockquote', 'pre', 'code',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small', 'mark', 'abbr', 'cite', 'q',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'a', 'img', 'figure', 'figcaption', 'picture', 'source',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    'details', 'summary', 'iframe',
  ],
  allowedAttributes: {
    '*': ['id', 'class', 'title', 'lang', 'dir', 'style'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'],
    source: ['srcset', 'sizes', 'type', 'media'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
    ol: ['start', 'type', 'reversed'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'title', 'loading', 'referrerpolicy'],
  },
  // Inline styles from the Shopify rich-text editor: keep layout/typography only.
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify|start|end)$/],
      'font-weight': [/^(normal|bold|bolder|lighter|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^[a-z\s-]+$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https', 'http'], source: ['https', 'http'], iframe: ['https'] },
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite', 'srcset'],
  allowProtocolRelative: false,
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
  disallowedTagsMode: 'discard',
  // Content inside these is dropped entirely, not unwrapped into text.
  nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'template'],
  transformTags: {
    a: (tagName, attribs) => {
      const next = { ...attribs };
      if (next.target === '_blank') {
        const rel = new Set((next.rel ?? '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        next.rel = [...rel].join(' ');
      } else if (next.target && next.target !== '_self') {
        delete next.target;
      }
      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => {
      const next = { ...attribs };
      if (next.src?.startsWith('http://')) next.src = `https://${next.src.slice(7)}`;
      return { tagName, attribs: next };
    },
    iframe: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, referrerpolicy: 'strict-origin-when-cross-origin', loading: 'lazy' },
    }),
  },
};

export function sanitizeContentHtml(html: string | null | undefined): string {
  if (!html) return '';
  return sanitizeHtml(html, OPTIONS);
}
