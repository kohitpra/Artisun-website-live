import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import JournalShell from '@/components/journal/JournalShell';
import JournalCard from '@/components/journal/JournalCard';
import ArticleToc from '@/components/journal/ArticleToc';
import {
  getJournalArticle,
  getJournalArticles,
  longDate,
  REVALIDATE,
  truncate,
} from '@/lib/journal';

export const revalidate = REVALIDATE;

// A static export (GitHub Pages) needs at least one path from
// generateStaticParams, even when the blog is empty or Shopify isn't
// configured. This handle is emitted in that case and always 404s.
const PLACEHOLDER = '__no-articles__';

export async function generateStaticParams() {
  const cards = await getJournalArticles();
  if (!cards.length) return [{ handle: PLACEHOLDER }];
  return cards.map((c) => ({ handle: c.handle }));
}

type Props = { params: { handle: string } };

// Posts without a featured image in Shopify still need an og/Article image.
const DEFAULT_ARTICLE_IMAGE = 'https://artisunskin.com/og-home.jpg';
const articleImageUrl = (a: { image: { url: string; large?: string | null } | null }) =>
  a.image ? a.image.large ?? a.image.url : DEFAULT_ARTICLE_IMAGE;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.handle === PLACEHOLDER) return {};
  const article = await getJournalArticle(params.handle);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description =
    article.seoDescription || article.answerBlock || truncate(article.excerpt || article.plainText, 160);
  const url = `https://artisunskin.com/blog/${article.handle}`;
  const imageUrl = articleImageUrl(article);

  return {
    title: `${title} | Artisun`,
    description,
    alternates: { canonical: `/blog/${article.handle}` },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Artisun',
      locale: 'en_IN',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: [{ url: imageUrl }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function ArticlePage({ params }: Props) {
  if (params.handle === PLACEHOLDER) notFound();

  const [article, all] = await Promise.all([
    getJournalArticle(params.handle),
    getJournalArticles(),
  ]);
  if (!article) notFound();

  // Same rule as the theme: the next three posts in the blog, excluding this one.
  const related = all.filter((c) => c.handle !== article.handle).slice(0, 3);
  const url = `https://artisunskin.com/blog/${article.handle}`;

  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: [articleImageUrl(article)],
    articleBody: article.plainText,
    ...(article.answerBlock && { description: article.answerBlock }),
    author: {
      '@type': 'Person',
      name: article.author,
      ...(article.authorRole && { jobTitle: article.authorRole }),
    },
    ...(article.reviewedBy && { reviewedBy: { '@type': 'Person', name: article.reviewedBy } }),
    publisher: {
      '@type': 'Organization',
      name: 'Artisun',
      logo: { '@type': 'ImageObject', url: 'https://artisunskin.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://artisunskin.com' },
      { '@type': 'ListItem', position: 2, name: 'Artifacts', item: 'https://artisunskin.com/blog' },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  };

  return (
    <JournalShell>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {article.faq.length > 0 && (
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faq.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }}
        />
      )}
      {article.tags.includes('Skinwear') && (
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: 'Skinwear',
            description:
              "Artisun's term for daily sun protection designed to be worn like a garment rather than tolerated as a chore.",
            inDefinedTermSet: 'https://artisunskin.com',
          }}
        />
      )}

      <div className="journal">
        <article className="j-article">
          <Link href="/blog" className="j-back">
            ← All Artifacts
          </Link>

          <header className="j-article-head">
            <div className="eyebrow">{article.tags[0] || 'Journal'}</div>
            <h1>{article.title}</h1>
            <div className="j-article-meta">
              <span>
                {article.author}
                {article.authorRole && ` — ${article.authorRole}`}
              </span>
              <time dateTime={article.publishedAt}>{longDate(article.publishedAt)}</time>
              <span>{article.minutes} min read</span>
              {article.reviewedBy && <span>Reviewed by {article.reviewedBy}</span>}
            </div>
          </header>

          {article.answerBlock && (
            <div className="j-answer">
              <div className="label">In short</div>
              <p>{article.answerBlock}</p>
            </div>
          )}

          <ArticleToc items={article.toc} />

          <div className="prose" dangerouslySetInnerHTML={{ __html: article.html }} />

          {article.faq.length > 0 && (
            <div className="j-faq">
              <h2>Frequently asked</h2>
              {article.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          )}

          {article.sourcesHtml && (
            <div className="j-sources">
              <div className="label">Sources</div>
              <div dangerouslySetInnerHTML={{ __html: article.sourcesHtml }} />
            </div>
          )}

          <div className="j-author-card">
            <div>
              <div className="name">{article.author}</div>
              {article.authorRole && <div className="role">{article.authorRole}</div>}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="j-more-wrap">
            <div className="j-more-head">
              <div className="j-header-eyebrow">More Like This</div>
              <h2 className="j-more-title">Keep exploring Artifacts</h2>
            </div>
            <div className="j-grid j-more-grid">
              {related.map((card) => (
                <JournalCard key={card.handle} card={card} />
              ))}
            </div>
          </section>
        )}
      </div>
    </JournalShell>
  );
}
