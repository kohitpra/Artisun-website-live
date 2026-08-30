'use client';

/**
 * Outlined tag pill — the style from your reference screenshot.
 *
 * Hairline cream outline, fully transparent fill, uppercase with wide tracking.
 * Replaces the two inconsistent treatments that were in use before: a filled
 * `bg-white/10 rounded-full` version on the hero panels and a frosted
 * `rounded-md` version on the product panels. Both PDPs now share this one.
 *
 * The tag CONTENT is unchanged — only the container styling moved.
 */
export default function TagPills({
  tags,
  className = '',
  align = 'start',
}: {
  tags: string[];
  className?: string;
  align?: 'start' | 'center';
}) {
  return (
    <div
      className={`flex flex-wrap gap-1.5 sm:gap-2 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } ${className}`}
    >
      {tags.map((t) => (
        <span
          key={t}
          className="font-suisse text-[9.5px] sm:text-[11px] font-normal tracking-[0.08em] uppercase whitespace-nowrap px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[var(--brand-cream)]/45 text-[var(--brand-cream)]/90 bg-transparent"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
