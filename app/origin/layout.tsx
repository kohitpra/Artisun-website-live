import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import ProductViewContent from '@/components/analytics/ProductViewContent';
import { PRODUCTS } from '@/lib/tracking-config';
import { getVariantGtin13 } from '@/lib/shopify';

// Used only if the Shopify barcode can't be read at build/revalidate time.
const GTIN13_FALLBACK = '8908032751001';

export const metadata: Metadata = {
  title: 'Origin 4-in-1 Milk Sunscreen SPF 50+ PA++++ | Artisun',
  description:
    'A 4-in-1 milk sunscreen — serum, moisturiser, SPF 50+ PA++++ and primer in one light layer. No white cast, great for oily skin. Built for Indian weather.',
  alternates: {
    canonical: '/origin',
  },
  openGraph: {
    title: 'Origin 4-in-1 Milk Sunscreen SPF 50+ PA++++ | Artisun',
    description:
      'A 4-in-1 milk sunscreen — serum, moisturiser, SPF 50+ PA++++ and primer in one light layer. Built for Indian weather.',
    url: 'https://artisunskin.com/origin',
    siteName: 'Artisun',
    images: [
      {
        url: 'https://artisunskin.com/product-shots/origin-square.webp',
        width: 800,
        height: 800,
        alt: 'Origin 4-in-1 Milk Sunscreen SPF 50+ PA++++',
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
  name: 'Origin 4-in-1 Milk Sunscreen SPF 50+ PA++++',
  image: ['https://artisunskin.com/product-shots/origin-square.webp'],
  description:
    'A 4-in-1 milk sunscreen — serum, moisturiser, SPF 50+ PA++++ and primer in one light layer. No white cast, great for oily skin. Built for Indian weather.',
  sku: 'ART-ORIGIN-50',
  mpn: 'ART-ORIGIN',
  brand: {
    '@type': 'Brand',
    name: 'Artisun',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://artisunskin.com/origin',
    priceCurrency: 'INR',
    price: '1499',
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
      name: 'Origin',
      item: 'https://artisunskin.com/origin',
    },
  ],
};

export default async function OriginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtin13 = await getVariantGtin13(PRODUCTS.origin.variantGid, GTIN13_FALLBACK);
  const productSchema = { ...baseProductSchema, gtin13 };

  return (
    <>
      {/* Open Graph product tags. Rendered as <meta property> (what Facebook reads);
          React hoists these into <head>. */}
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content="1499" />
      <meta property="product:price:currency" content="INR" />
      {/* Meta ViewContent in the initial HTML (see component for de-dupe logic) */}
      <ProductViewContent product={PRODUCTS.origin} />
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}