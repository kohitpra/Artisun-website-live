'use client';

export default function SkinwearForgettable() {
  return (
    <section className="relative z-[15] w-full flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 text-center">

      {/* Centered Heading */}
      <h2 className="font-editorial text-[var(--brand-cream)] text-[clamp(2.5rem,6vw,5.8rem)] leading-[1.1] tracking-[-0.02em] max-w-[1000px]">
        Fashion gets weeks
        <br />
        Runaways, a culture
        <br />
        Suncare got a drawer
      </h2>

      {/* Paragraph Block */}
      <div className="mt-4 sm:mt-6 md:mt-10 w-full max-w-[1300px] mx-auto space-y-3 sm:space-y-5 md:space-y-8">
       {/* Paragraph 1 */}
        <p className="font-suisse text-[var(--brand-cream)]/90 text-[15px] sm:text-[16px] md:text-[25px] lg:text-[29px] leading-[1.5] md:leading-[1.4] tracking-[0.02em] [word-spacing:0.12em] font-normal">
          Think about how much we celebrate what we wear — the shows, the
          <br className="hidden sm:block" />
          seasons, the endless conversations about what&apos;s on the outside.
        </p>

        {/* Paragraph 2 */}
        <p className="font-suisse text-[var(--brand-cream)]/90 text-[15px] sm:text-[16px] md:text-[25px] lg:text-[29px] leading-[1.5] md:leading-[1.4] tracking-[0.02em] [word-spacing:0.12em] font-normal">
          Now think about what your skin got: a forgettable tube you were told
          <br className="hidden sm:block" />
          to use. The thing facing the world every day, and it never got invited
          <br className="hidden sm:block" />
          to the party.
        </p>

      </div>
    </section>
  );
}