import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

/*
 * The Weather Duo page is a client component, so it can't export metadata
 * itself. Without this layout it inherited the ROOT layout's canonical ("/")
 * and og:url (the homepage), which told Google the page was a copy of the
 * homepage and kept it out of search results.
 */

const URL = 'https://artisunskin.com/weather-duo';
const TITLE = 'The Weather Duo: Origin + Aura Sunscreen Set | Artisun';
const DESCRIPTION =
  'Origin milk sunscreen SPF 50+ for dry, hot months and Aura pearl sunscreen SPF 40 for humid ones. Two climate-smart sunscreens in one set, for every Indian season.';
const OG_IMAGE = 'https://artisunskin.com/product-shots/weather-duo-og.jpg';
const PRODUCT_IMAGE = 'https://artisunskin.com/product-shots/weather-duo-square.webp';
const PRICE = '3298';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/weather-duo',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Artisun',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'The Weather Duo: Origin SPF 50+ and Aura SPF 40 sunscreens',
      },
    ],
    locale: 'en_IN',
  },
  // Overrides the root layout's twitter block, which points at the homepage image.
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  // og:type=product is rendered as <meta property> below, because Next's typed
  // openGraph.type has no "product" option.
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'The Weather Duo: Origin + Aura',
  image: [PRODUCT_IMAGE],
  description: DESCRIPTION,
  brand: {
    '@type': 'Brand',
    name: 'Artisun',
  },
  // The two products in the set.
  isRelatedTo: [
    { '@type': 'Product', name: 'Origin 4-in-1 Milk Sunscreen SPF 50+ PA++++', url: 'https://artisunskin.com/origin' },
    { '@type': 'Product', name: 'Aura Pearl Sunscreen SPF 40 PA++++', url: 'https://artisunskin.com/aura' },
  ],
  offers: {
    '@type': 'Offer',
    url: URL,
    priceCurrency: 'INR',
    price: PRICE,
    priceValidUntil: '2027-12-31',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://artisunskin.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://artisunskin.com/all-products' },
    { '@type': 'ListItem', position: 3, name: 'The Weather Duo', item: URL },
  ],
};

export default function WeatherDuoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={PRICE} />
      <meta property="product:price:currency" content="INR" />
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}
