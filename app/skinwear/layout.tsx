import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SkinWhere | Artisun',
  description: 'SkinWhere — a scroll-driven cinematic portrait experience.',
};

export default function SkinwhereLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}