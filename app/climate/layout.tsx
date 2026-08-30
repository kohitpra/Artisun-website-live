import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Climate-Smart | Artisun',
  description: 'Formulated for extreme weather, humidity, and daily climate exposure.',
};

export default function ClimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}