import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import JournalShell from '@/components/journal/JournalShell';
import JournalIndex from '@/components/journal/JournalIndex';
import { getJournalArticles } from '@/lib/journal';

// Server deploys (Netlify) re-check Shopify at most this often.
// Next 15 needs a literal here. Keep in sync with REVALIDATE in lib/journal.ts.
export const revalidate = 300;

const TITLE = 'Artifacts — The Skinwear Journal by Artisun';
const DESCRIPTION =
  'Field notes on weather, wear, and the science of sunscreen that actually holds up. Guides to sun protection for Indian skin and Indian weather.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://artisunskin.com/blog',
    siteName: 'Artisun',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function BlogPage() {
  const cards = await getJournalArticles();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Artifacts by Artisun',
    url: 'https://artisunskin.com/blog',
    description: DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'Artisun',
      url: 'https://artisunskin.com',
      logo: 'https://artisunskin.com/logo.png',
    },
    blogPost: cards.slice(0, 20).map((c) => ({
      '@type': 'BlogPosting',
      headline: c.title,
      url: `https://artisunskin.com/blog/${c.handle}`,
      datePublished: c.publishedAt,
    })),
  };

  return (
    <JournalShell>
      <JsonLd schema={schema} />
      <JournalIndex cards={cards} />
    </JournalShell>
  );
}
