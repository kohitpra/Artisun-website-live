import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #5A190D 0%, #3A0F07 55%, #1F0704 100%)',
        color: 'var(--brand-cream, #f5f0eb)',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(217,56,30,0.35), transparent 70%)',
        }}
      />

      <span className="font-editorial text-[80px] sm:text-[120px] md:text-[140px] leading-none tracking-tight opacity-30 select-none">
        404
      </span>

      <h1 className="font-editorial text-[26px] sm:text-[36px] md:text-[42px] leading-tight tracking-tight mt-1 mb-3">
        Out of range.
      </h1>

      <p className="font-suisse text-[13px] sm:text-[15px] max-w-[380px] text-[#E8DCC8]/70 leading-relaxed mb-8">
        The page or address you entered isn&rsquo;t here. Let&rsquo;s get you back to the collection.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-7 py-3 bg-[#E8DAC7] text-[#242623] hover:bg-white font-suisse text-[12px] font-semibold uppercase tracking-[0.14em] transition-all rounded-none"
        >
          Return Home
        </Link>
        <Link
          href="/all-products"
          className="w-full sm:w-auto px-7 py-3 border border-white/30 text-[var(--brand-cream,#f5f0eb)] hover:bg-white/10 font-suisse text-[12px] uppercase tracking-[0.14em] transition-colors rounded-none"
        >
          View Collection
        </Link>
      </div>
    </main>
  );
}