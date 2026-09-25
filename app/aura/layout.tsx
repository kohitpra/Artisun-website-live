import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import ProductViewContent from '@/components/analytics/ProductViewContent';
import { PRODUCTS } from '@/lib/tracking-config';
import { getVariantGtin13 } from '@/lib/shopify';

// Used only if the Shopify barcode can't be read at build/revalidate time.
const GTIN13_FALLBACK = '8908032751018';

export const metadata: Metadata = {
  title: 'Aura Pearl Sunscreen SPF 40 PA++++ | Skinwear by Artisun',
  description:
    'Pearl sunscreen that adjusts to your weather — broad-spectrum SPF 40 with skincare in every pearl. No white cast, a soft dewy finish. Built for Indian skin.',
  alternates: {
    canonical: '/aura',
  },
  openGraph: {
    title: 'Aura Pearl Sunscreen SPF 40 PA++++ | Skinwear by Artisun',
    description:
      'Pearl sunscreen that adjusts to your weather — broad-spectrum SPF 40 with skincare in every pearl. No white cast, a soft dewy finish. Built for Indian skin.',
    url: 'https://artisunskin.com/aura',
    siteName: 'Artisun',
    images: [
      {
        url: 'https://artisunskin.com/product-shots/aura-square.webp',
        width: 800,
        height: 800,
        alt: 'Aura Pearl Sunscreen SPF 40 PA++++',
      },
    ],
    locale: 'en_IN',
  },
  // og:type=product is rendered as <meta property> in the layout below,
  // because Next's typed openGraph.type has no "product" option.
};

const baseProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Aura Pearl Sunscreen SPF 40 PA++++',
  image: ['https://artisunskin.com/product-shots/aura-square.webp'],
  description:
    'Pearl sunscreen that adjusts to your weather — broad-spectrum SPF 40 with skincare in every pearl. No white cast, a soft dewy finish. Built for Indian skin.',
  sku: 'ART-AURA-40',
  mpn: 'ART-AURA',
  brand: {
    '@type': 'Brand',
    name: 'Artisun',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://artisunskin.com/aura',
    priceCurrency: 'INR',
    price: '1799',
    priceValidUntil: '2027-12-31',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://artisunskin.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      item: 'https://artisunskin.com/collection',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Aura',
      item: 'https://artisunskin.com/aura',
    },
  ],
};

export default async function AuraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtin13 = await getVariantGtin13(PRODUCTS.aura.variantGid, GTIN13_FALLBACK);
  const productSchema = { ...baseProductSchema, gtin13 };

  return (
    <>
      {/* Open Graph product tags. Rendered as <meta property> (what Facebook reads);
          React hoists these into <head>. */}
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content="1799" />
      <meta property="product:price:currency" content="INR" />
      {/* Meta ViewContent in the initial HTML (see component for de-dupe logic) */}
      <ProductViewContent product={PRODUCTS.aura} />
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}