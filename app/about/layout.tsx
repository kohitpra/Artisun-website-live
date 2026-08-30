import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ARTISUN — An Indian Sun-Care House',
  description:
    'Artisun is an Indian sun-care house built around the sun and the way we live with it. We make Skinwear — wearable layers that protect, hydrate, and move with the day.',
  openGraph: {
    title: 'About ARTISUN — An Indian Sun-Care House',
    description:
      'Artisun is an Indian sun-care house built around the sun and the way we live with it. We make Skinwear — wearable layers that protect, hydrate, and move with the day.',
    type: 'website',
    siteName: 'ARTISUN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ARTISUN — An Indian Sun-Care House',
    description:
      'Artisun is an Indian sun-care house built around the sun and the way we live with it. Skinwear for the Indian skin, for the Indian climate.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
