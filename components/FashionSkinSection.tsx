'use client';

export default function FashionSkinSection() {
    return (
        <section
            /* z-20 is load-bearing. HeroSection carries z-[1]; this section had no
               z-index at all, so it computed to auto (0) and the hero painted ON TOP
               of it — which is the second face you could see bleeding in from the
               right edge. Every other home section already declares z-10/z-20; this
               one was the only one that didn't. */
            className="relative w-full h-[100svh] min-h-[650px] overflow-hidden select-none z-20"
            style={{
                background: 'radial-gradient(ellipse at 50% 45%, #D44026 0%, #8A2718 50%, #420f08 100%)',
            }}
        >

            {/* Ambient Radial Depth Vignette */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(5,2,1,0.45) 100%)',
                }}
            />

            {/* Model Image: Grounded on Mobile, Full Bleed on Laptop */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-end justify-center leading-none w-full h-[58vh] sm:h-[65vh] lg:h-full overflow-visible">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/wo bg.webp"
                    alt=""
                    className="h-[50vh] xs:h-[53vh] sm:h-[64vh] md:h-[75vh] lg:h-[90vh] max-w-none w-auto object-contain object-bottom block align-bottom select-none scale-[1.18] xs:scale-[1.22] sm:scale-100 origin-bottom -translate-x-[5%] sm:-translate-x-[8%] lg:translate-x-0 translate-y-0"
                />
            </div>

            {/* Description: Exactly Matched to 1st Reference Image on Mobile */}
            <div className="absolute top-[82px] xs:top-[90px] sm:top-[110px] lg:top-[14%] xl:top-[16%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-16 z-30 w-full max-w-[360px] sm:max-w-[460px] lg:max-w-[500px] pointer-events-none text-center lg:text-left px-4 sm:px-0">
                <p className="font-suisse text-[var(--brand-cream,#f5f0eb)] text-[16px] xs:text-[20px] sm:text-[20px] lg:text-[31px] font-normal lg:font-light leading-[1.2] lg:leading-[1.12] tracking-[-0.01em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                    <span className="block lg:hidden">
                        Fashion gets weeks.<br />
                        Skin gets a shelf.<br />
                        We&rsquo;re changing that.
                    </span>
                    <span className="hidden lg:block">
                        Fashion gets weeks. Skin gets<br />
                        a shelf. We&rsquo;re changing that.
                    </span>
                </p>
            </div>

            {/* Heading & Button: Tightly Proportioned & Close to Model on Mobile */}
            {/* Heading & Button: Tightly Proportioned & Close to Model on Mobile */}
            <div className="absolute top-[150px] xs:top-[158px] sm:top-[230px] lg:top-[14%] xl:top-[16%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-14 xl:right-16 z-30 flex flex-col items-center lg:items-end w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[520px] lg:w-auto lg:max-w-[440px] xl:max-w-[480px] pointer-events-auto text-center lg:text-left px-4 sm:px-0">
                <h2 className="w-full font-editorial text-[var(--brand-cream,#f5f0eb)] text-[40px] xs:text-[49px] sm:text-[54px] lg:text-[58px] xl:text-[64px] leading-[0.94] lg:leading-[1.02] tracking-[-0.02em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                    <span className="block lg:hidden">
                        What&rsquo;s your skin<br />
                        wearing today?
                    </span>
                    <span className="hidden lg:block whitespace-nowrap">
                        What&rsquo;s your skin<br />
                        <span className="inline-block pl-8 xl:pl-12">wearing today?</span>
                    </span>
                </h2>

                {/* 2 Parallel Buttons: Solid Beige Color */}
                <div className="flex w-full max-w-[260px] xs:max-w-[290px] sm:max-w-none gap-2 sm:gap-3 mt-3.5 sm:mt-5 lg:mt-6 mx-auto lg:mx-0">
                    <a
                        href="/origin"
                        className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 bg-[#E8C5A5] hover:bg-[#FAF6EE] text-[#420f08] font-suisse text-[11px] sm:text-[12.5px] lg:text-[13px] tracking-[0.14em] font-medium uppercase items-center justify-center text-center transition-all duration-300 shadow-md active:scale-[0.98] whitespace-nowrap"
                    >
                        Wear Origin
                    </a>
                    <a
                        href="/aura"
                        className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 bg-[#E8C5A5] hover:bg-[#FAF6EE] text-[#420f08] font-suisse text-[11px] sm:text-[12.5px] lg:text-[13px] tracking-[0.14em] font-medium uppercase items-center justify-center text-center transition-all duration-300 shadow-md active:scale-[0.98] whitespace-nowrap"
                    >
                        Wear Aura
                    </a>
                </div>
            </div>

            {/* ARTISUN Logo: Layered above Model (z-30) on Mobile/Tabs, Background (z-10) on Laptop */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 sm:bottom-[1vh] lg:bottom-[4vh] left-1/2 -translate-x-1/2 z-30 lg:z-10 w-[98vw] sm:w-[94vw] lg:w-[98vw] max-w-[1500px] px-2 sm:px-4 flex justify-center pointer-events-none select-none"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/Artisun Primary Logo.webp"
                    alt=""
                    className="w-full h-auto object-contain opacity-95 drop-shadow-[0_10px_35px_rgba(0,0,0,0.3)]"
                    draggable={false}
                />
            </div>

        </section>
    );
}